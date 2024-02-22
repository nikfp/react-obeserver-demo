import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState<string[]>([]);

  // function to add more entries
  const addEntries = function (): string[] {
    const elements = Array.from(Array(10)).fill(Math.random().toString());
    return elements;
  };

  // populate initial array on first render
  useEffect(() => {
    setItems(() => addEntries());
  }, []);

  const bottom = useRef(null);

  useEffect(() => {
    //get the reference to the bottom element
    const bottomCurrent = bottom.current;

    //build options table for observer
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    // create an observer with a callback function that adds more entries
    const observer = new IntersectionObserver((entries) => {
      //we only have one 'bottom' so we only need the first entry
      const first = entries[0];

      // guard clause - if it's not intersecting do nothing
      if (!first.isIntersecting) {
        return;
      }

      // add more items to the list
      setItems((value) => {
        return [...value, ...addEntries()];
      });
    }, options);

    // begin observing the element we want to watch for
    if (bottomCurrent) {
      observer.observe(bottomCurrent);
    }

    return () => {
      // clean up by stopping observation
      if (bottomCurrent) {
        observer.unobserve(bottomCurrent);
      }
    };
  });

  // The bottom element is what we look for.
  // When it enters the viewport, it triggers the
  // observer callback, which loads more elements
  // and pushed this down off the screen again.
  //
  // Note that bottom must be 80% in the viewport to
  // trigger the callback. That was set in the options.
  return (
    <>
      <h1>Hello World</h1>
      {items.map((el) => {
        return <div className="list-item">{el}</div>;
      })}
      <div ref={bottom} className="bottom">
        Bottom Element - End of List
      </div>
    </>
  );
}

export default App;
