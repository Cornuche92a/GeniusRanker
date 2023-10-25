const getFaqPlans = async () => {
  return  JSON.parse(JSON.stringify([
    {
      "id": 1,
      "question": "What is Lorem Ipsum?",
      "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      "id": 2,
      "question": "What is Lorem Ipsum?",
      "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      "id": 3,
      "question": "What is Lorem Ipsum?",
      "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
  ]))
}

export default getFaqPlans
