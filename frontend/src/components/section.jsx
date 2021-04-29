import '../css/content.css';
import '../css/section.css';

function Section (props) {
  return (
    <section className="app-fullpage">
    	<header className="section-header">{props.sectionTitle}</header>
    </section>
  );
}

export default Section;
