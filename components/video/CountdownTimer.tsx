interface CountdownTimerProps {
  seconds: number;
}

const CountdownTimer = ({ seconds }: CountdownTimerProps) => {
  return (
    <div className="absolute top-0 left-0 p-4 text-white bg-black bg-opacity-50">
      <p>Реклама закончится через {seconds} секунд</p>
    </div>
  );
};

export default CountdownTimer;
