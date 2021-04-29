import logo from '../logo.svg';
import '../css/content.css';

function FrontPage() {
  return (
    <div id="myFrontPage" className="app-fullpage">
	    <img src={logo} className="App-logo" alt="logo" />
	    <p>
	      Edit <code>src/App.js</code> and save to reload.
	    </p>
	    <a
	      className="App-link"
	      href="https://reactjs.org"
	      target="_blank"
	      rel="noopener noreferrer"
	    >
	      Learn React
    	</a>
    </div>
  );
}

export default FrontPage;
