interface FeedbackToastProps {
  message: string;
}

function FeedbackToast({ message }: FeedbackToastProps) {
  if (!message) {
    return null;
  }
  return (
    <p className="feedback-toast" role="status">
      {message}
    </p>
  );
}

export default FeedbackToast;
