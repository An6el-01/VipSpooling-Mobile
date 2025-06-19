import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { createInvoiceForm } from '@/src/graphql/mutations';
import { useNavigation } from '@react-navigation/native';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    jobTypeCheckboxes
)  => {
    console.log('Starting PDF generation...');

    let pdfDoc;
    try{
        console.log('Loading Invoice Form PDF template...');
        const asset = Asset.fromModule(require('../assets/InvoiceForm.pdf'))
        await asset.downloadAsync();
        const templateBytes = await FileSystem.readEntireFileAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
        pdfDoc = await PDFDocument.load(Buffer.from(templateBytes, 'based64'));
    } catch (error) {
        console.warn('Could not load InvoiceForm.pdf templat, creating a blank A4 page instead.', error);
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([595, 842]);
    }

    let page = pdfDoc.getPage(0);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;
    const textColor = rgb(0, 0, 0);

    // Work Information
    page.drawText(formData.workTicketNo || 'N/A', { x: 100, y: 825, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(selectedDate?.format('YYYY-MM-DD') || 'N/A', { x: 46.8, y: 804, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.spooler || 'N/A', { x: 62.9, y: 779, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.workType || 'N/A', { x: 77.5, y: 759, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.cableCompany || 'N/A', { x: 99.8, y: 714, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.cableCompanyLocation || 'N/A', { x: 144, y: 694, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.oilCompany || 'N/A', { x: 84.4, y: 669, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.wellNumber || 'N/A', { x: 402.3, y: 694, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.wellName || 'N/A', { x: 392.3, y: 669, size: fontSize, font: helveticaFont, color: textColor });

    // Job Type Checkboxes
    const checkboxSize = 12;
    //Row 1
    if (jobTypeCheckboxes.Install) {
        page.drawText('X', { x: 52, y: 524, size: checkboxSize, font: helveticaFont, color: textColor });
    }
    if(jobTypeCheckboxes.Pull) {
        page.drawText('X', { x: 52, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
    }
    if(jobTypeCheckboxes.GasLift) {
        page.drawText('X', { x: 169, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
    }
    if(jobTypeCheckboxes.GasInstall) {
        page.drawText('X', { x: 169, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
    }
    //Row 2
    if (jobTypeCheckboxes.CTSpooler) {
        page.drawText('X', { x: 294.09, y: 526, size: checkboxSize, font: helveticaFont, colo: textColor });
    }
    if (jobTypeCheckboxes.CableSpooler) {
        page.drawText('X', { x: 294.09, y: 500, size: checkboxSize, font: helveticatFont, color: textColor });
    }
    if (jobTypeCheckboxes.ComboSpooler) {
        page.drawText('X', { x: 447.67, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
    }
    if(jobTypeCheckboxes.TechnicialLaydown) {
        page.drawText('X', { x: 447.67, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
    }


    // Consumables
    let currentY = 550;
      const consumableRowHeight = 26;
      formData.consumables.forEach((consumable, index) => {
        page.drawText(consumable.item || 'N/A', { x: 52, y: currentY, size: fontSize, font: helveticaFint, color: textColor });
        page.drawText(consumable.qty || '0', { x: 260, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(`$${consumable.rate || '0.00'}`, { x: 360, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(`$${consumable.amount.toFixed(2)}`, { x: 489, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
        currentY -= consumableRowHeight;
    });

    if (formData.notes) {
        const maxWidth = 550;
        const lineHeight = 14;
        let currentY = 150;
        const words = formData.notes.split(' ');
        let line = '';
        const lines = [];

        for (const word of words) {
            const testLine = line ? `${line} ${word}` : word;
            const width = helveticaFont.widthOfTextAtSize(testLine, fontSize);
            if (width <= maxWidth){
                line = testLine;
            } else {
                if (line) {
                    lines.push(line);
                }
                line = word;
            }
        }
        if (line) {
            lines.push(line);
        }

        for (const lineText of lines) {
            if (currentY < 50) {
                page = pdfDoc.addPage([595, 842]);
                currentY = 780;
                page.drawText('Notes (Continued)', { x: 18, y: currentY, size: 12, font: helveticaFont, color: textColor });
                currentY -= 35;
            }
            page.drawText(lineText, { x: 18, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
            currentY -= lineHeight;
        }
    }
    // Footer
    page.drawText(formData.cableLength || 'N/A', { x: 105, y: 68, size: fontSize, font:helveticaFont, color: textColor });
    page.drawText(formData.reelNumber || 'N/A', { x: 290, y: 68, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(formData.cableType || 'N/A', { x: 82, y: 47, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(`$${formData.extraCharges || 0.00}`, { x: 290, y: 47, size: fontSize, font: helveticaFont, color: textColor });

    // Invoice Total
    const total = 1310.00;
    page.drawText(`$${total}`, { x: 90, y: 30, size: fontSize, font: helveticaFont, color: textColor });

    // Customer Signature
    if (formData.customerSignature) {
        try {
            console.log('Converting signature for embedding...');
            const startConvert = Date.now();
            const base64Data = formData.signature.replace(/^data:image\/png;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64'); 

            // Option 1: Embed as PNG directly 
            console.log('Embedding signature as PNG...');
            const signatureImage = await pdfDoc.embedPng(imageBuffer);
            pdfDoc.drawImage(signatureImage,  { x: 410, y: 40, width: 80, height: 40 });
            console.log('Signature drawn on page.')
        }  catch (error) {
            console.error('Error embedding signature to PDF:', error);
        }
    }
    // Save and upload to S3
    const pdfBytes = await pdfDoc.save();
    const fileName = `invoice-${formData.workTicketNo || 'Unknown'}-${Date.now()}.pdf`;

    //Save PDF to temporary local storage before uploading to S3
    const tempPdfUri = FileSystem.cacheDirectory + fileName;
    await FileSystem.writeAsStringAsync(tempPdfUri, Buffer.from(pdfBytes).toString('base64'), { encoding: FileSystem.EncodingType.Base64 });
    const fileContent = await FileSystem.readAsStringAsync(tempPdfUri, { encoding: FileSystem.EncodingType.Base64 });

    const params = {
        Bucket: 'vip-completed-invoices',
        Key: fileName,
        Body: Buffer.from(fileContent, 'base64'),
        ContentType: 'application/pdf',
    };
    await s3Client.send(new PutObjectCommand(params));
    return `s3://${params.Bucket}/${params.Key}`;
};

const NewForm = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        worTicketNo: "",
        date: "",
        spooler: "",
        cableCompany: "",
        cableCompanyLocation: "",
        oilCompany: "",
        wellNumber: "",
        wellName: "",
        workType: "",
        reelNumber: "",
        cableLength: "",
        cableType: "",
        extraCharges: "",
        notes: "",
        signature: "",
        rates: [
            { description: "Load/Unload", quantity: "", rate: "", total: 0 },
            { description: "Spooler Miles To", quantity: "", rate: "", total: 0 },
            { description: "Travel Time", quantity: "", rate: "", total: 0 },
            { description: "Standby Time", quantity: "", rate: "", total: 0 },
            { description: "Spooler Labor", quantity: "", rate: "", total: 0 },
        ],
        consumables: [{ item: "", qty: "", rate: "", amount: 0 }],
    });

    const [jobTypeCheckboxes, setJobTypeCheckboxes] = useState({
        Install: false,
        Pull: false,
        GasLift: false,
        CTSpooler: false,
        ComboSpooler: false,
        GasInstall: false,
        CableSpooler: false,
        TechnicalLaydown: false,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const sigCanvas = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleConsumableChange = (index, field, value) => {
        const updatedConsumables = [...formData.consumables];
        updatedConsumables[index][field] = value;

        if (field === 'qty' || field === 'rate'){
            const qty = Number(updatedConsumables[index].qty) || 0;
            const rate = Number(updatedConsumables[index].rate) || 0;
            updatedConsumables[index].amount = qty * rate;
        }

        setFormData({ ...formData, consumables: updatedConsumables });
    };

    const addConsumable = () => {
        setFormData({
            ...formData,
            consumables: [...formData.consumables, { item: "", qty: "", rate: "", amount: 0 }],
        });
    };

    const removeConsumable = (index) => {
        const updatedConsumables = formData.consumables.filter((_, i) => i !== index);
        setFormData({ ...formData, consumables: updatedConsumables });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRateChange = (index, field, value) => {
        const updatedRates = [...formData.rates];
        updatedRates[index] = {
            ...updatedRates[index],
            [field]: value
        };

        const qty = Number(updatedRates[index].quantity) || 0;
        const rate = Number(updatedRates[index].rate) || 0;
        updatedRates[index].total = qty * rate;

        setFormData(prev => ({
            ...prev,
            rates: updatedRates
        }));
    };

    const openSignatureModal = () => {
        setIsModalOpen(true);
    };

    const saveSignature = () => {
        if (sigCanvas.current !== null) {
            const signatureImage = sigCanvas.current.toDataURL("image/png");
            setFormData({
                ...formData,
                signature: signatureImage,
            });
            setIsModalOpen(false);
        }
    };

    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
    };

    const handleCheckboxChange = (checkboxId) => {
        setJobTypeCheckboxes(prev => ({
            ...prev,
            [checkboxId]: !prev[checkboxId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            if (!formData.signature) {
                alert('Please add a signature before submitting.');
                return;
            }

            const s3Url = await fillAndUploadPDF(formData, selectedDate, jobTypeCheckboxes);
            console.log('Final product uploaded to S3:', s3Url);

            const invoiceData = {
                WorkTicketId: formData.worTicketNo,
                InvoiceDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0],
                Spooler: formData.spooler,
                WorkType: formData.workType,
                CableCompanyLocation: formData.cableCompanyLocation,
                OilCompany: formData.oilCompany,
                WellNumberName: formData.wellNumber,
                ReelNumber: formData.reelNumber,
                ExtraCharges: Number(formData.extraCharges) || 0,
                Notes: formData.notes || "",
                CustomerSignature: formData.signature,
                InvoiceTotal: formData.rates.reduce((sum, rate) =>  sum + rate.total, 0) + 
                    formData.consumables.reduce((sum, consumable) => sum + consumable.amount, 0) +
                    Number(formData.extraCharges || 0),
                LaborCosts: formData.rates.map((rate) => ({
                    rate: Number(rate.rate) || 0,
                    qty: Number(rate.quantity) || 0,
                    amount: rate.total,
                })),
                Consumables: formData.consumables.map((consumable) => ({
                    item: consumable.item,
                    qty: Number(consumable.qty) || 0,
                    rate: Number(consumable.rate) || 0,
                    amount: consumable.amount
                })),
                CableDetails: {
                    CableType: formData.cableType || "",
                    CableLength: formData.cableLength || 0,
                },
                JobType: Object.keys(jobTypeCheckboxes).filter(key => jobTypeCheckboxes[key])
            };

            const response = await client.graphql({
                query: createInvoiceForm,
                variables: { input: invoiceData },
                authMode: 'userPool',
            });

            if (response.data?.createInvoiceForm) {
                setFormData({
                    workTicketNo: "",
                    date: "",
                    spooler: "",
                    cableCompany: "",
                    cableCompanyLocation: "",
                    oilCompany: "",
                    wellNumber: "",
                    wellName: "",
                    workType: "",
                    reelnumber: "",
                    cableLength: "",
                    cableType: "",
                    extraCharges: "",
                    notes: "",
                    signature: "",
                    rates: [
                        { description: "Load/Unload", quantity: "", rate: "", total: 0 },
                        { description: "Spooler Miles To", quantity: "", rate: "", total: 0 },
                        { description: "Travel Time", quantity: "", rate: "", total: 0 },
                        { description: "Standby Time", quantity: "", rate: "", total: 0 },
                        { description: "Spooler Labor", quantity: "", rate: "", total: 0 },
                    ],
                    consumables: [{ item: "", qty: "", rate: "", amount: 0 }],
                });
                setSelectedDate(null);
                sigCanvas.current?.clear();

                setJobTypeCheckboxes({
                    Install: false,
                    Pull: false,
                    GasLift: false,
                    CTSpooler: false,
                    ComboSpooler: false,
                    GasInstall: false,
                    CableSpooler: false,
                    TechnicianLaydown: false,
                });
                alert('Invoice created successfully to:' + s3Url);
            }
        } catch (error) {
            console.error('Error submitting invoice: ', error);
        }
    }
}