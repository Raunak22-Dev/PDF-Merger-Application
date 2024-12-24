import express from 'express'; 
import multer from 'multer'; 
import path from 'path';
import { mergePdf } from './merge.js'; 
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: 'uploads/' }); 
const app = express();

app.use(express.static('public')); 
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
  try {
    if (!req.files || req.files.length !== 2) {
      return res.status(400).send('Please upload exactly two PDF files.');
    }

    const filePath1 = path.join(__dirname, req.files[0].path);
    const filePath2 = path.join(__dirname, req.files[1].path);

    const pages1 = req.body.pages1 || 'all';
    const pages2 = req.body.pages2 || 'all';

    const outputFile = await mergePdf(filePath1, pages1, filePath2, pages2);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); 

    res.redirect(`/static/${outputFile}`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Error merging PDFs');
  }
});


// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
