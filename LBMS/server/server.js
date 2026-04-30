const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/books', bookRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});