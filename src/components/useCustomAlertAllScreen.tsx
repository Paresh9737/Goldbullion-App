// useCustomAlert.tsx
import {useState} from 'react';

interface AlertConfig {
  title: string;
  message?: string;
  confirmText: string;
  onConfirm: () => void;
}

export const useCustomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });

  const showAlert = (alertConfig: AlertConfig) => {
    setConfig(alertConfig);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return {
    visible,
    alertConfig: config,
    showAlert,
    hideAlert,
  };
};
