import '../css/window.css';


function SpaceWindow (props) {
	const backgroundStr = "url(./" + props.backgroundImage + ".jpg)";
  return (
    <div className="space-window" style={{ background: backgroundStr }}>
    </div>
  );
}

export default SpaceWindow;
