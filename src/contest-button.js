// import logo from './logo.svg';
import './contest-button.css';

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
    
    <div class="contest-button">
      <button class="left">
        <div class="content">
          Div. 1
        </div>
      </button>
      <button class="among">
        <div class="content">
          Div. 2
        </div>
      </button>
      <button class="among">
        <div class="content">
          Div. 3
        </div>
      </button>
      <button class="among">
        <div class="content">
          Div. 4
        </div>
      </button>
      <button class="among">
        <div class="content">
          Educational
        </div>
      </button>
      <button class="among">
        <div class="content">
          Div. 1 + Div. 2
        </div>
      </button>
      <button class="among">
        <div class="content">
          Global
        </div>
      </button>
      <button class="among">
        <div class="content">
          Global
        </div>
      </button>
      <button class="right">
        <div class="content">
          All
        </div>
      </button>  
    </div>
  );
}

export default App;