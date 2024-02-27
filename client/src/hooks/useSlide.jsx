import {useState} from 'react'

export default function useSlide(data) {
    const [current, setCurrent] = useState(0)
    let imgLength = data;

    const nextSlide = ()=> {
        setCurrent(current === imgLength - 1 ? 0 : current + 1)
    }
    const prevSlide = ()=> {
        setCurrent(current === 0 ? imgLength - 1 : current - 1)
    }
  return {nextSlide, prevSlide, current, setCurrent}
}
