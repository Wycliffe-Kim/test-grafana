import { Alert } from './Alert';
import AlertType from './AlertType';

type AlertMapType = { [key in AlertType]: Alert; };

export default AlertMapType;