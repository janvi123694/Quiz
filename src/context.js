import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [waiting, setWaiting] = useState(true); //setup form or quiz ques
    const [loading, setLoading] = useState(false); 
    const [questions, setQuestions] = useState([]); 
    const [index, setIndex] = useState(0); // question no 1
    const [correct, setCorrect] = useState(0); 
    const [error, setError] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [quiz, setQuiz] = useState({
      amount : 10, 
      category : 'sports', 
      difficulty : 'easy'
    })

    const fetchQuestions = async(url)=>{
      setLoading(true); 
      setWaiting(false); 
      const response = await axios(url).catch((err) => console.log(err))
      //console.log(response); 
      if(response){
        const data = response.data.results;
        console.log(data)
        if(data.length > 0){
          setQuestions(data); 
          setLoading(false); 
          setWaiting(false); 
          setError(false); 
        }
        else{
          setWaiting(true); 
          setError(true); 
        }
      }
      else{
        setWaiting(true); 
      }
    }


    const nextQuestion=()=>{
      setIndex((curIndex)=>{
        const nextIndex = curIndex + 1; 
        if(nextIndex >= questions.length){
          openModal(); 
          return 0; 
        }
        else{
          return curIndex + 1; 
        }
      })
    }

    const checkAnswer =(value) => {
      if(value){
        setCorrect((curState) => curState + 1)
      }
      nextQuestion()
    }

    const openModal = () => {
      setIsModalOpen(true); 
    }

    const closeModal = () => {
      setIsModalOpen(false); 
      setWaiting(true); 
      setCorrect(true);
    }

    const handleChange = (e) => {
      
      const name = e.target.name; 
      const value = e.target.value; 
      console.log(name, value);
      setQuiz({...quiz, [name]:value})
    }

    const handleSubmit = (e)=>{
      e.preventDefault(); 
      const {amount, category, difficulty} = quiz; 
      const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;

      fetchQuestions(url)
    }
     


    return (
      <AppContext.Provider value={{
        waiting, 
        loading, 
        questions, 
        index, 
        correct, 
        error, 
        quiz,
        isModalOpen,
        nextQuestion, 
        checkAnswer, 
        closeModal, 
        handleChange, 
        handleSubmit
      }}>
        {children}
      </AppContext.Provider>
    )
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
