import React, { cloneElement, Component, createContext, forwardRef, ReactElement, ReactInstance, useContext, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import scrollIntoView from "scroll-into-view"

interface ScrollViewProps {
  children: ReactElement
}

interface ScrollElementProps {
  children: ReactElement;
  name: string
}

type ScrollObject = {
  register: (name: string, ref: ReactInstance) => void,
  unregister: (name: string) => void
}

type state = {
  element: { [key: string]: ReactInstance }
}

const ScrollContext = createContext<{ [key: string]: ScrollObject }>({})

class ScrollViewClass extends Component<ScrollViewProps, state>{
  state: state = {
    element: {}
  }
  register = (name: string, ref: ReactInstance) => {
    //this.elements[name] = ref;
    this.state.element[name] = ref
    const temp = this.state.element
    this.setState({ element: temp })
  }
  unregister = (name: string) => {
    delete this.state.element[name]
    const temp = this.state.element
    this.setState({ element: temp })
  }
  getChildContext() {
    return {
      scroll: {
        register: this.register,
        unregister: this.unregister
      }
    }
  }
  scrollTo = (name: string) => {
    const node = findDOMNode(this.state.element[name]);
    scrollIntoView(
      //@ts-ignore
      node,
      {
        time: 500,
        align: {
          top: 0.5
        }
      }
    )
  }
  render() {
    return (
      <ScrollContext.Provider value={this.getChildContext()}>
        {React.Children.only(this.props.children)}
      </ScrollContext.Provider>
    );
  }
}

/*const ScrollView = (props: ScrollViewProps) => {
  const [element, setElement] = useState<{ [key: string]: ReactInstance }>({})

  const getChildContext = () => {
    return {
      scroll: {
        register: register,
        unregister: unregister
      }
    }
  }


  const register = (name: string, ref: ReactInstance) => {
    element[name] = ref
    setElement(element)
  }

  const unregister = (name: string) => {
    delete element[name]
    setElement(element)
  }

  const scrollTo = (name: string) => {
    const node = findDOMNode(element[name])
    scrollIntoView(
      //@ts-ignore
      node,
      {
        time: 500,
        align: {
          top: 0.5
        }
      }
    )
  }

  return (
    //React.Children.only(props.children)
    <ScrollContext.Provider value={getChildContext()}>
      {React.Children.only(props.children)}
    </ScrollContext.Provider>
  )
}*/

export function ScrollElement(props: ScrollElementProps) {
  const scroll = useContext(ScrollContext)
  const [element, setElement] = useState<ReactInstance | null>(null)
  useEffect(() => {
    //@ts-ignore
    scroll.scroll.register(props.name, element)
    return () => {
      scroll.scroll.unregister(props.name)
    }
  })
  return (
    cloneElement(props.children, {
      ref: (ref: ReactInstance) => setElement(ref)
    })
  )

}

export default ScrollViewClass