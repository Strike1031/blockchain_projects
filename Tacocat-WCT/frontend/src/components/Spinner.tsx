import { PropagateLoader } from 'react-spinners';
import '../css/styles.css';

interface SpinnerProps {
    spinnerShow: boolean;
    message: string;
}

const Spinner = ({spinnerShow, message}: SpinnerProps) => {
    
    return (
        <div className="spinner-container" style={{display: spinnerShow? "block" : "none"}}>
        <PropagateLoader size={20} color="white"></PropagateLoader>
        <span className="spinner-text" style={{color: "white"}}>{message}</span>
        </div>
    );
};

export default Spinner;