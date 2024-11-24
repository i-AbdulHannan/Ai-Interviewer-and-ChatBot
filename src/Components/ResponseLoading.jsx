// import { ring, LoadingContainer } from "./ResponseLoading.module.css";
import { container, bounceball, text } from "./ResponseLoading.module.css";

const ResponseLoading = () => {
  return (
    // <div className={LoadingContainer}>
    //   <div className={ring}></div>
    //   <div className={ring}></div>
    //   <div className={ring}></div>
    //   <span className="text-white  ">
    //     Generate <br /> Response...
    //   </span>
    // </div>
    <div className={container}>
      <div>
        <div className={bounceball}></div>
        <div className={text}>Generate Response...</div>
      </div>
    </div>
  );
};

export default ResponseLoading;
