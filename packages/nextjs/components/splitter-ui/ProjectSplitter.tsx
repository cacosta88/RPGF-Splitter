import React, { useEffect, useState } from 'react';
import projectsData from '/public/assets/projects.json'; 
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth';
import { EtherInput } from '../scaffold-eth/Input'; 

const ProjectSplitter = ({ account, splitterContract }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [inputEthAmount, setInputEthAmount] = useState('');
  const [totalEthAmount, setTotalEthAmount] = useState('');
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [selectedImpactCategory, setSelectedImpactCategory] = useState('All');
  const [nameFilter, setNameFilter] = useState(''); 

  const maxProjects = 25; 


  const handleProjectSelect = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else if (selectedProjects.length < maxProjects) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      alert(`Maximum of ${maxProjects} projects can be selected`);
    }
  };

 
  const handleFilterChange = (e) => {
    setSelectedImpactCategory(e.target.value);
  };

  
  useEffect(() => {
    if (selectedProjects.length > 0 && inputEthAmount) {
      const totalAmount = (parseFloat(inputEthAmount) / selectedProjects.length).toFixed(18);
      setTotalEthAmount(totalAmount.toString()); 
      setTotalEthAmount('');
    }
  }, [inputEthAmount, selectedProjects]);


 const selectedAddresses = selectedProjects.map(id => 
  projectsData.find(project => project.project_id === id).applicant_address
);


useEffect(() => {
  if (selectedProjects.length > 0 && inputEthAmount) {
    const totalAmount = parseFloat(inputEthAmount).toFixed(18);
    setTotalEthAmount(totalAmount.toString()); 
  } else {
    setTotalEthAmount('');
  }
}, [inputEthAmount, selectedProjects]);


const { writeAsync: splitEqualETH } = useScaffoldContractWrite({
  contractName: "ETHSplitter",
  functionName: "splitEqualETH",
  args: [selectedAddresses],
  value: totalEthAmount,
});

const handleSplitEth = async () => {
  setIsTransactionProcessing(true);
  setTransactionStatus('');
  try {
    await splitEqualETH();
    setTransactionStatus('Success! ETH has been split among the selected projects.');


    setInputEthAmount('');
    setSelectedProjects([]);
    setTotalEthAmount('');
    setNameFilter('');
    setSelectedImpactCategory('All');

  } catch (error) {
    setTransactionStatus('Error: Transaction failed. Please try again.');
  }
  setIsTransactionProcessing(false);
};


  const filteredProjects = projectsData.filter(project => {
    return (selectedImpactCategory === 'All' || project.impact_category === selectedImpactCategory) &&
           project.project_name.toLowerCase().includes(nameFilter.toLowerCase());
  });

  return (
    <div className="project-splitter">
      <br />
      <p className="text-3xl font-bold text-center text-white mb-4">Select up to {maxProjects} projects to split ETH equally among them</p>
      <div className='text-center'>
        <label className="text-center text-white text-center" htmlFor="name-filter">Filter by Project Name: </label>
        <input
          id="name-filter"
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Type to filter projects by name"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <br/>
      <div className="text-white text-center" style={{ marginLeft: '-19px' }}>
        <label htmlFor="impact-category-filter">Filter by Impact Category: </label>
        <select
          id="impact-category-filter"
          value={selectedImpactCategory}
          onChange={handleFilterChange}
          className="select select-bordered w-full max-w-xs"
          style={{ color: selectedImpactCategory === 'All' ? 'black' : 'white' }}
        >
          <option style={{ color: 'black' }} value="All">All</option>
          {[...new Set(projectsData.map(project => project.impact_category))].map(category => (
            <option style={{ color: 'black' }} key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <br/>
      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        <ul>
          {filteredProjects.map(project => (
            <li key={project.project_id} onClick={() => handleProjectSelect(project.project_id)} className={`p-2 ${selectedProjects.includes(project.project_id) ? 'bg-green-200' : 'bg-gray-200'} rounded-md`}>
              <h3>{project.project_name}</h3>
              <p>Address: {project.applicant_address}</p> {/* Display project address */}
              <p>{project.impact_category}</p>
              <p>Status: {selectedProjects.includes(project.project_id) ? 'Selected' : 'Not selected'}</p>
            </li>
          ))}
        </ul>
      </div>
      <br/>
      <div className="text-center text-white">
        <h4>Selected Projects ({selectedProjects.length}):</h4>
        <br/>
        <ul className='text-center text-white'>
          {selectedProjects.map(id => {
            const project = projectsData.find(proj => proj.project_id === id);
            return (
              <li className='text-center text-white' key={id} className="flex items-center justify-between">
                <span>
                  {project.project_name} - {project.applicant_address}
                </span>
                <span className
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleProjectSelect(id)}
                >
                  &#10006; 
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <br/>
      <div className="text-center text-white">
        <label htmlFor="eth-amount">Total ETH Amount to Split:</label>
        <EtherInput
          value={inputEthAmount}
          onChange={setInputEthAmount}
          placeholder="Enter ETH amount"
        />
      </div>
      <br/>
      <button 
  disabled={selectedProjects.length === 0 || !inputEthAmount || isTransactionProcessing}
  onClick={handleSplitEth}
  className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
  
  {isTransactionProcessing ? 'Processing...' : 
    `Send ${inputEthAmount} ETH to ${selectedProjects.length} ${selectedProjects.length === 1 ? 'project' : 'projects'}, each receiving ${(parseFloat(inputEthAmount) / selectedProjects.length).toFixed(4)} ETH`}
</button>
     
    </div>
  );
};

export default ProjectSplitter;
