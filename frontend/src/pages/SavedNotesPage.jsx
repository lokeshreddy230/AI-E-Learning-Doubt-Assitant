import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List as ListIcon, Trash2, Download, FileText, Loader2, BookOpen } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const SavedNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/api/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      toast.success("Note deleted.");
    } catch (error) {
      toast.error("Failed to delete note.");
    }
  };

  const generatePDFContent = (doc, note, startY = 20) => {
    let yPos = startY;
    
    const addText = (text, x, y, size, isBold = false) => {
      if (!text) return y;
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      // Split text keeping line breaks intact
      const rawLines = String(text).split('\n');
      let currentY = y;
      
      for (let rawLine of rawLines) {
        const lines = doc.splitTextToSize(rawLine, 170);
        for (let i = 0; i < lines.length; i++) {
          if (currentY > 280) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(lines[i], x, currentY);
          currentY += size === 16 ? 10 : (size === 12 ? 8 : 6);
        }
      }
      return currentY + 4; // Extra padding below block
    };

    yPos = addText(note.title, 20, yPos, 16, true);
    yPos = addText(`Date: ${new Date(note.created_at).toLocaleDateString()}`, 20, yPos, 10);
    yPos += 4;

    try {
      const parsed = JSON.parse(note.content);
      yPos = addText(`Subject: ${parsed.subject || 'General'}`, 20, yPos, 12, true);
      yPos += 4;
      
      if (parsed.question) {
        yPos = addText("Original Question:", 20, yPos, 12, true);
        yPos = addText(parsed.question, 20, yPos, 11);
        yPos += 4;
      }
      
      if (parsed.answer) {
        yPos = addText("AI-Generated Explanation:", 20, yPos, 12, true);
        yPos = addText(parsed.answer, 20, yPos, 11);
        yPos += 4;
      }
      
      if (parsed.key_points && parsed.key_points.length > 0) {
        yPos = addText("Key Points:", 20, yPos, 12, true);
        parsed.key_points.forEach(point => {
            yPos = addText(`• ${point}`, 25, yPos, 11);
        });
        yPos += 4;
      }

      if (parsed.summary) {
        yPos = addText("Summary:", 20, yPos, 12, true);
        yPos = addText(parsed.summary, 20, yPos, 11);
      }
    } catch (e) {
      // Fallback for plain text notes
      yPos = addText("Content:", 20, yPos, 12, true);
      yPos = addText(note.content, 20, yPos, 11);
    }
    
    return yPos;
  };

  const handleDownloadPDF = (note) => {
    try {
      const doc = new jsPDF();
      generatePDFContent(doc, note);
      doc.save(`${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF.');
      console.error(error);
    }
  };

  const handleExportAll = () => {
    if (notes.length === 0) {
      toast.error("No notes to export.");
      return;
    }
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Title Page
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("EduAI Knowledge Library", 105, 100, null, null, "center");
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 115, null, null, "center");
      doc.text(`${notes.length} Notes Total`, 105, 125, null, null, "center");
      
      // Table of Contents
      doc.addPage();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Table of Contents", 20, 30);
      
      let tocY = 45;
      notes.forEach((note, index) => {
        if (tocY > 280) {
          doc.addPage();
          tocY = 20;
        }
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        let subject = "General";
        try { subject = JSON.parse(note.content).subject || subject; } catch(e){}
        
        doc.text(`${index + 1}. ${note.title} (${subject})`, 20, tocY);
        tocY += 10;
      });

      // Note Pages
      notes.forEach((note, index) => {
        doc.addPage();
        generatePDFContent(doc, note, 20);
      });

      doc.save(`EduAI_All_Notes_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('All notes exported successfully!');
    } catch (error) {
      toast.error('Failed to export notes.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getSubject = (note) => {
    try {
      return JSON.parse(note.content).subject || 'General';
    } catch {
      return 'General';
    }
  };

  const getPreview = (note) => {
    try {
      const parsed = JSON.parse(note.content);
      return parsed.summary || parsed.answer || 'No preview available.';
    } catch {
      return note.content;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
              <span>Learning Portal</span>
              <span>›</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">Saved Notes</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Knowledge Library</h1>
            <p className="text-gray-500 dark:text-gray-400">Access all your AI-generated explanations, study guides, and research notes in one place.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleExportAll}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium shadow-sm hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export All to PDF
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit border border-gray-200 dark:border-gray-700 ml-auto">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                <ListIcon className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Notes Grid/List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notes found</h3>
            <p className="text-gray-500 dark:text-gray-400">You haven't saved any notes yet or none match your search.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {getSubject(note)}
                    </span>
                    <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {getPreview(note)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDownloadPDF(note)}
                    className="text-primary-600 dark:text-primary-400 text-sm font-bold flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition"
                  >
                    Download PDF <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedNotesPage;
