import React from 'react';
import BuildForm from './components/BuildForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './index.css';
import './App.css';

function App() {
    return (
        <div className="App">

            <BuildForm />
        </div>
    );
}

export default App;
