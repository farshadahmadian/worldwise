import styles from "./Message.module.css";

type MessagePropsType = {
  message: string;
};

function Message({ message }: MessagePropsType) {
  return (
    <p className={styles.message}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
