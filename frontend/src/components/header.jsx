
import '../css/sticky-header.css';
import { useEffect, useState } from "react";

function StickyHeader() {

  const fixedText = "I am fixed :)";
  const whenNotFixed = "I am not a fixed header :(";
  const [headerText, setHeaderText] = useState(whenNotFixed);
  useEffect(() => {
    const header = document.getElementById("myHeader");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        if (headerText !== fixedText) {
          setHeaderText(fixedText);
        }
      } else {
        header.classList.remove("sticky");
        if (headerText !== whenNotFixed) {
          setHeaderText(whenNotFixed);
        }
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  return (

    <div id="myHeader" className="app-header">
      <div className="header-inner-container">
        <div className="header-menu-item">Map</div>
        <div className="header-menu-item">Charts</div>
        <div className="header-menu-item">Explanation</div>
      </div>
    </div>
  );
}

export default StickyHeader;
