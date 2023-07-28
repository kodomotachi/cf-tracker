import logo from './logo.svg';
import './App.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Date: 07.05.2023 at Thu Duc City, Ho Chi Minh City, Vietnam.
    //     </p>
    //     <p>
    //       {/* Edit <code>src/App.js</code> and save to reload. */}
    //       Author: KodomoTachi and developers: Sterryn, Shirokun and zuyyy1412
    //     </p>
    //     <p>
    //       Hello world. This is my project about tracking performance on Codeforces.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //     <p>
    //       Coming soon.
    //     </p>
    //     <table>
    //       <tr>
    //         <th>Company</th>
    //         <th>Contact</th>
    //         <th>Country</th>
    //       </tr>
    //       <tr>
    //         <td>Alfreds Futterkiste</td>
    //         <td>Maria Anders</td>
    //         <td>Germany</td>
    //       </tr>
    //       <tr>
    //         <td>Centro comercial Moctezuma</td>
    //         <td>Francisco Chang</td>
    //         <td>Mexico</td>
    //       </tr>
    //       </table>
    //   </header>
    // </div>
    
    <div className="row">
      <div role="group" className="tale-tab btn-group">
        <button type="button" className="btn btn-secondary active">Div. 1</button>
        <button type="button" className="btn btn-secondary active">Div. 2</button>
        <button type="button" className="btn btn-secondary active">Div. 3</button>
        <button type="button" className="btn btn-secondary active">Div. 4</button>
        <button type="button" className="btn btn-secondary active">Educational</button>
        <button type="button" className="btn btn-secondary active">Div. 1 + Div. 2</button>
        <button type="button" className="btn btn-secondary active">Global</button>
        <button type="button" className="btn btn-secondary active">Others</button>
        <button type="button" className="btn btn-secondary active">All</button>
      </div>
    </div>
  );
}

export default App;
