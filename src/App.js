import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import CompetenceTable from './components/CompetenceTable';
import FileUpload from './components/FileUpload';

function App() {
  const [data, setData] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showCompanies, setShowCompanies] = useState(true);
  
  const handleFileUpload = (fileData) => {
    setData(fileData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analyse des Compétences</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Analyse
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Import
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {data ? (
              <>
                <div className="flex gap-4 mb-4">
                  <select
                    className="border p-2 rounded"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">Tous les types</option>
                    {Array.from(new Set(data.map(item => item['Type ']))).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowCompanies(!showCompanies)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {showCompanies ? 'Masquer' : 'Afficher'} les entreprises
                  </button>
                </div>

                <CompetenceTable
                  data={data}
                  selectedType={selectedType}
                  showCompanies={showCompanies}
                />
              </>
            ) : (
              <div className="text-center p-4 bg-yellow-100 rounded">
                Veuillez d'abord importer vos données dans l'onglet "Import"
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            <FileUpload onFileUpload={handleFileUpload} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default App;