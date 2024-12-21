import React, { useState } from 'react';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CompetenceTable from './components/CompetenceTable';
import FileUpload from './components/FileUpload';
import { Alert } from '@/components/ui/alert';

function App() {
  const [data, setData] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showCompanies, setShowCompanies] = useState(true);
  const [activeTab, setActiveTab] = useState('analyse');
  
  const handleFileUpload = (fileData) => {
    setData(fileData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analyse des Compétences</h1>
      
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="analyse">Analyse</Tab>
        <Tab value="import">Import de données</Tab>
      </Tabs>

      {activeTab === 'import' && (
        <FileUpload onFileUpload={handleFileUpload} />
      )}

      {activeTab === 'analyse' && data && (
        <>
          <div className="flex gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {/* Options will be populated from data */}
            </select>

            <Button
              onClick={() => setShowCompanies(!showCompanies)}
            >
              {showCompanies ? 'Masquer' : 'Afficher'} les entreprises
            </Button>
          </div>

          <CompetenceTable
            data={data}
            selectedType={selectedType}
            showCompanies={showCompanies}
          />
        </>
      )}

      {activeTab === 'analyse' && !data && (
        <Alert>
          Veuillez d'abord importer vos données dans l'onglet "Import"
        </Alert>
      )}
    </div>
  );
}

export default App;
