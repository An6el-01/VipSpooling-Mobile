"use client";

import React from 'react';
import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { createJsaForm } from '@/src/graphql/mutations';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createCanvas, loadImage } from 'canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const client = generateClient();

const getCredentials = async () => {
    const session = await fetchAuthSession();
    if(!session.credentials) throw new Error('No credentials available');
    return{
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken,
    };
};

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: getCredentials,
});


const fillAndUploadPDF = async (
    formData,
    selectedDate,
) => {
    console.log('Starting PDF generation...');

    let pdfDoc;
    try{
        console.log('Loading JSA Form PDF template...');
        const asset = Asset.fromModule(require('../assets/JSAForm.pdf'));
        await asset.downloadAsync();
        const templateBytes = await FileSystem.readEntireFileAync(asset, localUri, { encoding: FileSystem.EncodingType.Base64 });
        pdfDoc = await PDFDocument.load(Buffer.from(templateBytes, 'based64'));
    } catch (error) {
        console.warn('Could not load JSAForm.pdf template, creating a blank A4 page instead.', error);
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([595, 842]);
    }

    let page = pdfDoc.getPage(0);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;
    const textColor = rgb(0, 0, 0);

    const customerNameLocation = `${formData.customerName || 'N/A'} - ${formData.location || 'N/A'}`;

    // Customer Name
    page.drawText(customerNameLocation || 'N/A', { x: 210, y: 953, size: fontSize, font: helveticaFont, color: textColor });

    //Effective Date
    page.drawText(selectedDate?.format('YYYY-MM-DD') || formData.effectiveDate || 'N/A', { x: 210, y: 953, size: fontSize, font: helveticaFont, color: textColor });

    const personnelRowHeight = 25;
    let currentY = 412;
    const personnelFontSize = 13;

    for (const person of formData.personnel) {
        //Draw job title
        page.drawText(person.jobTitle || 'N/A', {
            x: 45,
            y: currentY + 7,
            size: personnelFontSize,
            font: helveticaFont,
            color: textColor,
        });

        //Draw name
        page.drawText(person.name || 'N/A', {
            x: 203,
            y: currentY + 7,
            size: personnelFontSize,
            font: helveticaFont,
            color: textColor,
        });

        //Customer Signature
        if(person.signature){
            try{
                console.log(`'Converting signature for ${person.name} to PNG with transparency...'`);
                const startConvert = Date.now();

                const base64Data = person.signature.replace(/^data:image\/\png;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');

                //Load the image using node-canvas
                const img = await loadImage(imgBuffer);
                const canvas = createCanvas(img.width, img.height);
                const ctx = canvas.getContext('2d');

                // Do not fill the background to keep it transparent
                ctx.drawImage(img, 0, 0);

                //Convert to PNG buffer to preserve transparency
                const pngBuffer = canvas.toBuffer('image/png');
                console.log(`Signature converted to PNG in ${Date.now() - startConvert}ms`);

                //Embed the PNG image
                console.log(`'Embedding signature image (PNG) for ${person.name}...'`);
                const startEmbed = Date.now();
                const signatureImage = await pdfDoc.embedPng(pngBuffer);
                console.log(`Signature embedded in ${Date.now() - startEmbed}ms.`);

                //Draw the signature below the footer
                page.drawImage(signatureImage, { x: 540, y: currentY - 9, width: 80, height: 40 });
                console.log('Signature drawn on page.');
            } catch (error) {
                console.error('Error embedding signature (skipping signature):', error);
            }
        }
        currentY -= personnelRowHeight;
    }
};

const NewForm = () => {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        customerName: "",
        createdBy: "",
        effectiveDate: "",
        location: "",
        personnel: [{ name: "", jobTitle: "", signature: "" }],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSignatureIndex, setCurrentSignatureIndex] = useState(null);
    const sigCanvas = useRef(null);

    const jobTitles = [
        "Customer Rep",
        "Service Tech",
        "Spooler/Bander",
        "Rig Operator",
        "Rig Crew",
        "Other",
    ];

    const riskAssessment = [
        {
          category: "Low",
          frequency: "Harm or loss is unlikely to occur (Seldom – Occurs once every 5-10 yrs).",
          severity: "Minimal near miss or minor first aid injury.",
          riskScore: "Acceptable with present controls in place.",
        },
        {
          category: "Medium",
          frequency: "Harm or loss is possible, although only expected to occur occasionally (Occasional – Occurs once or more every 1 – 5 yrs).",
          severity: "Recordable injury, lost time, serious property damage, fires extinguished onsite.",
          riskScore: "Further controls should be considered and recommended.",
        },
        {
          category: "High",
          frequency: "Harm or loss is expected to occur frequently. (Frequent – Occurs one or more every 1-12 months).",
          severity: "Serious injury or fatality, major equipment damage, fires requiring offsite assistance, facility-wide fire, explosion, offsite impact, etc.",
          riskScore: "Additional controls must be identified and mandated.",
        },
      ];

      const ppeCodes = {
        A: "Safety Glasses",
        B: "Safety Shoes",
        D: "Hearing Protection (specify type)",
        E: "Hot Gloves (specify class & type)",
        F: "H2S Detector",
        G: "Hard Hat",
        H: "Coverall",
        I: "Fire Retardant Clothing / Coverall",
        J: "Chemical Resistant Boots",
        K: "Work Gloves (specify type)",
        L: "Chemical Resistant Gloves (specify type)",
        M: "Cut Resistant Gloves (specify type)",
        N: "Full-face Air-Purifying Respirator, specify cartridge",
        O: "Supplied Air Respirator, circle: SCBA or Airline",
        P: "Fall Protection",
        Q: "Personal Monitor, type:",
        R: "LOTO",
        S: "Other, specify:",
      };
    
      const jobSafetyAnalysis = [
        {
          stepNo: 1,
          taskStep: "Disconnect DH Cable",
          hazard: "Electrical",
          controls: "LOTO, Hot gloves",
          requiredPPE: "ABFGIKRE",
          riskRanking: "Low",
        },
        {
          stepNo: 2,
          taskStep: "Flange up BOP",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 3,
          taskStep: "Unseat and remove hanger",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 4,
          taskStep: "Rig up spoolers and pull well",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 5,
          taskStep: "Disassemble and lay down ESP",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
      ];

      const [selectedDate, setSelectedDate] = useState(null);

      const handleDateChange = (date) => {
        setSelectedDate(date);
      };

      const handlePersonnelChange = (index, field, value) => {
        const updatedPersonnel = [...formData.personnel];
        updatedPersonnel[index][field] = value;
        setFormData({ ...formData, personnel: updatedPersonnel });
      };

      const addPersonnel = () => {
        setFormData({
            ...formData,
            personnel: [...formData.personnel, { name: "", jobTitle: "", signature: ""}],
        });
      };

      const removePersonnel = (index) => {
        const updatedPersonnel = formData.personnel.filter((_, i) => i !== index);
        setFormData({ ...formData, personnel: updatedPersonnel });
      };

      const openSignatureModal = (index) => {
        setCurrentSignatureIndex(index);
        setIsModalOpen(true);
      };

      const saveSignature = () => {
        if(sigCanvas.current && currentSignatureIndex !== null){
            const signatureImage = sigCanvas.current.toDataURL("image/png");

            setFormData((prevData) => {
                const updatedPersonnel = [...prevData.personnel];
                updatedPersonnel[currentSignatureIndex] = {
                  ...updatedPersonnel[currentSignatureIndex],
                  signature: signatureImage,
                };
        
                return {
                  ...prevData,
                  personnel: updatedPersonnel
                };
              });

              setIsModalOpen(false);
        }
      };

      // Clear the signature pad
      const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
      };

      // Form submission
      const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            // Check if all required signatures exist
            const missingSignatures = formData.personnel.some(person => !person.signature);
            if (missingSignatures) {
                alert('Please ensure all personnel have signed the form.');
                return;
            }

            const s3Url = await fillAndUploadPDF(formData, selectedDate);
            console.log('Final product uploaded to S3:', s3Url);

            //Format the form data to match the CreateJsaFormInput type
            //Type assertion removed
            const jsaData = {
                CustomerName: formData.customerName,
                CreatedBy: formData.createdBy,
                FormDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                EffectiveDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                Location: formData.location,
                Personnel: formData.personnel.map(person => ({
                    Role: person.jobTitle,
                    PersonName: person.name,
                    Signature: person.signature,
                }))
            };

            console.log('Submitting JSA form data:', jsaData);

            //Submit the form data to the database
            const response = await client.graphql({
                query: createJsaForm,
                variables: { input: jsaData },
            });

            if(response.data?.createJsaForm){
                // Clear the form
                setFormData({
                    customerName: "",
                    createdBy: "",
                    effectiveDate: "",
                    location: "",
                    personnel: [
                      { name: "", jobTitle: "", signature: "" }
                    ]
                  });
                  setSelectedDate(null);

                  alert('JSA form submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting JSA form:', error);
            alert('Error submitting JSA form. Please try again.');
        }
      };
}