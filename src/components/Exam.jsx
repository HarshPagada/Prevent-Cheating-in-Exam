import React, { useEffect, useState, useRef } from 'react'
import Webcam from "react-webcam";
import { detectCheating, extractFaceCoordinates, getCheatingStatus, } from "../helpers/face-detection-helper";
import { NO_CHEATING_RESULT } from "../helpers/face-detection-constants";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";


const Exam = (props) => {
  const [examStarted, setExamStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes = 300 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [exam, setExam] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cheatingAlert, setCheatingAlert] = useState('');

  const webcamRef = useRef(null);
  const faceDetectionRef = useRef(null);

  // for decoding " "
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;
    return decodedString;
  };

  // Shuffle an array (Fisher-Yates Shuffle algorithm)
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const handleStart = () => {
    setExamStarted(true);
    setSubmitted(false)
    setIsRunning(true);

    fetch('https://opentdb.com/api.php?amount=5&category=18')
      .then(response => response.json())
      .then(data => {
        const formattedExam = data.results.map(question => {
          const allAnswers = [question.correct_answer, ...question.incorrect_answers];
          return {
            ...question,
            question: decodeHTMLEntities(question.question), // Decode HTML entities in the question
            allAnswers: shuffleArray(allAnswers),
          };
        });
        setExam(formattedExam);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setExamStarted(false);
    setIsRunning(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  // Effect to handle the countdown timer
  useEffect(() => {
    let timer;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      setSubmitted(true);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle visibility change event
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Tab is not visible
      showWarningMessage('Tab is not visible');
    }
  };

  // Handle window blur event
  const handleBlur = () => {
    showWarningMessage('Window lost focus');
  };

  // // Handle window focus event
  const handleFocus = () => {
    setShowWarning(false);
  };

  // // Handle window resize event
  const handleResize = () => {
    if (window.innerWidth < 800) { // Example condition: when window width is less than 800px
      showWarningMessage('Window resized to small size');
    }
  };

  // Show warning message for a specified duration
  const showWarningMessage = (message) => {
    setWarningMessage(message);
    setShowWarning(true);

    // Hide warning after 3 seconds
    setTimeout(() => {
      setShowWarning(false);
    }, 3000);
  };

  useEffect(() => {
    // Attach event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('resize', handleResize);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // face detection
  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      minDetectionConfidence: 0.5,
      model: "short",
    });

    function onResult(result) {
      if (result.detections.length < 1) {
        setCheatingAlert("Face not detected. Ensure your face is visible!");
        return;
      } else if (result.detections.length > 1) {
        setCheatingAlert("Multiple faces detected. Possible cheating!");
        return;
      }

      const faceCoordinates = extractFaceCoordinates(result);
      const [lookingLeft, lookingRight] = detectCheating(faceCoordinates);
      const cheatingStatus = getCheatingStatus(lookingLeft, lookingRight);
      setCheatingAlert(cheatingStatus);
    }

    faceDetection.onResults(onResult);
    faceDetectionRef.current = faceDetection;

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (examStarted) {
            await faceDetection.send({ image: webcamRef.current.video });
          }
        },
        // width: 1280,
        // height: 720,
      });

      camera.start();
    }

    return () => {
      faceDetection.close();
    };
  }, [examStarted]);


  return (
    <>
      <div>
        {showWarning && (
          <div className="alert alert-danger" role="alert">
            <a href="#" className="alert-link">Warning!</a> {warningMessage}
          </div>
        )}
      </div>

      <p className='mx-3 fw-bold'>Student_ID: {props.loggedInUser || 'Unknown'}</p>

      <div className='container'>
        <div className='exam_box'>
          <div className='exam_box_header'>
            <p className=''>Basic Programming</p>
            {!examStarted && (
              <button className='btn btn-warning' onClick={handleStart} disabled={submitted}>
                Start Exam
              </button>
            )}
            {examStarted && !submitted && (
              <button className='btn btn-warning' onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
          <hr />


          <div className='d-flex h-100'>
            <div className='w-75 p-4'>
              {!examStarted && !submitted && (
                <p className='text-dark text-center fw-bold'>Start Your Exam.</p>
              )}
              {examStarted && !submitted && exam.length > 0 && (
                <div>
                  <p>{exam[currentQuestionIndex]?.question}</p>
                  <ul className="list-unstyled">
                    {exam[currentQuestionIndex]?.allAnswers.map((answer, index) => (
                      <li key={index}>
                        <input
                          className='mx-2'
                          type='radio'
                          name='answer'
                          value={answer}
                          onChange={() => handleAnswerSelection(index)}
                        /> {answer}
                      </li>
                    ))}
                  </ul>
                  <button className='btn btn-outline-danger' onClick={handleNext} disabled={currentQuestionIndex >= exam.length - 1}>
                    Next
                  </button>
                </div>
              )}
              {submitted && (
                <p className='text-success text-center fw-bold'>Exam has been submitted.</p>
              )}
            </div>

            <div className=''>
              <p className=''>{formatTime(timeRemaining)}</p>
              <p className=''>5 Minutes</p>
              <p className=''>5 Questions</p>
            </div>
          </div>

        </div>
      </div>

      <div className='camera'>
        {cheatingAlert && <p className='text-danger fw-bold m-4'>{cheatingAlert}</p>}
        <div className='w-25 shadow p-3 mb-5 bg-body-tertiary'>
          {/* Webcam display */}
          <Webcam
            audio={true}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: 'user' }}
          />
        </div>
      </div>
    </>
  )
}

export default Exam
