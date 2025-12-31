const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File path for storing data
const dataFilePath = path.join(__dirname, 'data.txt');

// Ensure data.txt exists
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '=== MIDNIGHT TORQUE - DATA LOG ===\n\n');
}

// API endpoint to submit data
app.post('/api/submit', (req, res) => {
    try {
        const { type, ...data } = req.body;
        
        // Format data for text file
        let formattedData = `\n${'='.repeat(60)}\n`;
        formattedData += `TYPE: ${type}\n`;
        formattedData += `DATE & TIME: ${data.timestamp}\n`;
        formattedData += `${'-'.repeat(60)}\n`;
        
        if (type === 'CONTACT') {
            formattedData += `NAME: ${data.name}\n`;
            formattedData += `EMAIL: ${data.email}\n`;
            formattedData += `PHONE: ${data.phone}\n`;
            formattedData += `MESSAGE: ${data.message}\n`;
        } 
        else if (type === 'FEEDBACK') {
            formattedData += `NAME: ${data.name}\n`;
            formattedData += `EMAIL: ${data.email}\n`;
            formattedData += `PHONE: ${data.phone}\n`;
            formattedData += `RATING: ${data.rating}/5\n`;
            formattedData += `FEEDBACK: ${data.message}\n`;
        } 
        else if (type === 'ORDER') {
            formattedData += `CUSTOMER INFORMATION:\n`;
            formattedData += `  Name: ${data.customerInfo.name}\n`;
            formattedData += `  Email: ${data.customerInfo.email}\n`;
            formattedData += `  Phone: ${data.customerInfo.phone}\n`;
            formattedData += `\nDELIVERY ADDRESS:\n`;
            formattedData += `  ${data.customerInfo.address.line1}\n`;
            if (data.customerInfo.address.line2) {
                formattedData += `  ${data.customerInfo.address.line2}\n`;
            }
            formattedData += `  ${data.customerInfo.address.city}, ${data.customerInfo.address.state}\n`;
            formattedData += `  PIN: ${data.customerInfo.address.pincode}\n`;
            formattedData += `  ${data.customerInfo.address.country}\n`;
            formattedData += `\nORDERED ITEMS:\n`;
            data.items.forEach((item, index) => {
                formattedData += `  ${index + 1}. ${item.name} - ₹${item.price.toLocaleString()}\n`;
            });
            formattedData += `\nPRICE BREAKDOWN:\n`;
            formattedData += `  Subtotal: ₹${data.subtotal.toLocaleString()}\n`;
            if (data.discount > 0) {
                formattedData += `  Discount (10%): -₹${data.discount.toLocaleString()}\n`;
            }
            formattedData += `  TOTAL AMOUNT: ₹${data.total.toLocaleString()}\n`;
        }
        
        formattedData += `${'='.repeat(60)}\n\n`;
        
        // Append to file
        fs.appendFileSync(dataFilePath, formattedData, 'utf8');
        
        console.log(`✓ ${type} data saved to data.txt`);
        
        res.json({ 
            success: true, 
            message: 'Data saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save data'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Midnight Torque Backend Server Running`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`📝 Data File: ${dataFilePath}`);
    console.log(`\nReady to accept submissions!`);
});