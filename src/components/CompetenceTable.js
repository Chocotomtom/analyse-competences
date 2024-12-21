import React, { useMemo } from 'react';
import _ from 'lodash';

const CompetenceTable = ({ data, selectedType, showCompanies }) => {
  const processedData = useMemo(() => {
    // Filtrer par type si nécessaire
    let filteredData = selectedType === 'all'
      ? data
      : data.filter(item => item['Type '] === selectedType);

    // Grouper par catégorie et compétence
    const grouped = _.groupBy(filteredData, item => 
      `${item['Catégorie compétence']}-${item['Competences ']}`
    );

    // Transformer en structure finale
    return Object.entries(grouped).map(([key, items]) => {
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
  }, [data, selectedType]);

  // Grouper par catégorie pour l'affichage
  const categoriesGroup = _.groupBy(processedData, 'categorie');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
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
            <React.Fragment key={categorie}>
              {items.map((item, index) => (
                <tr key={`${categorie}-${item.competence}`}>
                  {index === 0 && (
                    <td
                      className="border p-2 font-bold"
                      rowSpan={items.length}
                    >
                      {categorie}
                    </td>
                  )}
                  <td className="border p-2">{item.competence}</td>
                  {showCompanies && (
                    <td className="border p-2">
                      {item.companies.join(', ')}
                    </td>
                  )}
                  {['06', '13', '42', '59', '62', '69', '75', '77', '78', '83', '91', '92', '93', '94', '95'].map(dept => (
                    <td key={dept} className="border p-2 text-center">
                      {item[dept]}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetenceTable;