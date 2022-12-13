import { useAppDispatch } from '../../hooks/typedHooks';
import { fetchProject } from '../../store/slices/ProjectSlice';

import './ErrorMessage.scss';

function ErrorMessage() {
  const dispatch = useAppDispatch();

  return (
    <div className="error-message">
      <h1 className="error-message__title">Something went wrong... try again later</h1>
      <button
        type="button"
        className="error-message__button"
        onClick={() => dispatch(fetchProject())}
      >
        try again
      </button>
      <div className="error-message__link">
        or go here and activate CORS
        <a target="_blank" rel="noreferrer" href="https://cors-anywhere.herokuapp.com/">https://cors-anywhere.herokuapp.com/</a>
      </div>
    </div>
  );
}

export default ErrorMessage;
