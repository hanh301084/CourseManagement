import { notification } from 'antd';

const openNotificationWithIcon = (type, title, description) => {
  notification[type]({
    message: title,
    description: description,
  });
};

export default openNotificationWithIcon;