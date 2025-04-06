import '@/pages/Spinner/Spinner.css';

export const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="intersecting-circles-spinner">
        <div className="spinnerBlock">
          <span className="circle"></span>
          <span className="circle"></span>
          <span className="circle"></span>
          <span className="circle"></span>
          <span className="circle"></span>
          <span className="circle"></span>
          <span className="circle"></span>
        </div>
      </div>
    </div>
  );
};
