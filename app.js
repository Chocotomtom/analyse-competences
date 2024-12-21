function App() {
    const [data, setData] = React.useState(null);
    const [selectedType, setSelectedType] = React.useState('all');
    const [showCompanies, setShowCompanies] = React.useState(true);
    const [view, setView] = React.useState('upload'); // 'upload' ou 'analysis'

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            setData(jsonData);
            setView('analysis');
        };

        reader.readAsArrayBuffer(file);
    };

    const CompetenceTable = ({ data, selectedType, showCompanies }) => {
        if (!data) return null;

        const filteredData = selectedType === 'all' 
            ? data 
            : data.filter(item => item['Type '] === selectedType);

        const grouped = _.groupBy(filteredData, item => 
            `${item['Catégorie compétence']}-${item['Competences ']}`
        );

        const processedData = Object.entries(grouped).map(([key, items]) => {
            const [categorie, competence] = key.split('-');
            const departments = ['06', '13', '42', '59', '62', '69', '75', '77', '78', '83', '91', '92', '93', '94', '95'];
            
            const departmentCounts = departments.reduce((acc, dept) => {
                acc[dept] = items.filter(item => item[dept] === 1).length;
                return acc;
            }, {});

            return {
                categorie,
                competence,
                companies: items.map(item => item['Nom ']),
                ...departmentCounts
            };
        });

        const categoriesGroup = _.groupBy(processedData, 'categorie');

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Catégorie</th>
                            <th className="border p-2">Compétence</th>
                            {showCompanies && <th className="border p-2">Entreprises</th>}
                            {['06', '13', '42', '59', '62', '69', '75', '77', '78', '83', '91', '92', '93', '94', '95'].map(dept => (
                                <th key={dept} className="border p-2">{dept}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(categoriesGroup).map(([categorie, items]) => (
                            items.map((item, index) => (
                                <tr key={`${categorie}-${item.competence}`} className="hover:bg-gray-50">
                                    {index === 0 && (
                                        <td className="border p-2 font-bold" rowSpan={items.length}>{categorie}</td>
                                    )}
                                    <td className="border p-2">{item.competence}</td>
                                    {showCompanies && (
                                        <td className="border p-2 text-sm">{item.companies.join(', ')}</td>
                                    )}
                                    {['06', '13', '42', '59', '62', '69', '75', '77', '78', '83', '91', '92', '93', '94', '95'].map(dept => (
                                        <td key={dept} className="border p-2 text-center">{item[dept]}</td>
                                    ))}
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const FileUpload = () => (
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Importez votre fichier Excel</h2>
            <div className="max-w-xl mx-auto bg-white p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full p-2 border rounded"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <header className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">Analyse des Compétences</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {view === 'upload' ? (
                    <FileUpload />
                ) : (
                    <div>
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setView('upload')}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                ← Retour à l'import
                            </button>
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
                    </div>
                )}
            </main>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);