
var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  };

  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }

    if (n === combinationSum) { return true; }
  }

  return false;
};

//NOTICE: React encourage you to use: functional programming (map, filter, reduce) instead of for loops

//Subcomponent of the game: Stars
const Stars= (props) => {
  return (
    <div className="col-5">
    {/*_. is used thanks to a library called lodash.Example of mapping with one element (i)*/}
    {_.range(props.numberOfStars).map(i => <i key={i} className="fa fa-star"></i>)}
    </div>
  );
};

//Subcomponent of the game: Button
const Button= (props) => {
  let button;
  switch(props.answerIsCorrect)
  {
    case true:
    button=<button className="btn btn-success" onClick={props.acceptAnswer}> <i className="fa fa-check"></i></button>;
    break;
    case false:
    button=<button className="btn btn-danger"> <i className="fa fa-times"></i></button>;
    break;
    default:
    button=<button className="btn" onClick={props.checkAnswer} disabled={props.selectedNumbers.length === 0}>=</button>;
    break;
  }
  return (
    <div className="col-2 text-center">
    {button}
    <br />
    <br />
    <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.redraws===0}>
    <i className="fa fa-refresh">{props.redraws}</i>
    </button>
    </div>
  );
}

//Subcomponent of the game : Answer, renders the div with the selected number
const Answer= (props) => {
  return (
    <div className="col-5">
    {/*This example of mapping is with two elements (number, i) */}
    {props.selectedNumbers.map((number, i)=>
      <span key={i} onClick={()=>props.unselectNumber(number)}>
      {number}
      </span>)}
      </div>
    );
  }

  //Subcomponent of the game : Numbers
  const Numbers= (props) => {

    //auxiliary variable to set if the number has been selected or not
    const numberClassName = (number) => {
      if(props.usedNumbers.indexOf(number) >= 0)
      {
        return 'used';
      }
      if(props.selectedNumbers.indexOf(number) >= 0)
      {
        return 'selected';
      }
    };

    return (
      <div className="card text-center">
      <div>

      {/* This is the syntax to display an element based on an array of numbers */}
      {Numbers.list.map((number, i) =>
        <span key={i} className={numberClassName(number)} onClick={()=>props.selectNumber(number)}>
        {number}
        </span>)}
        {/* NOTICE: in the OnClick event we are passing the selected number into the level up. */}

        </div>
        </div>
      );
    };

    //Subcomponent of the game : Done with the game wether you lost or won!!
    const DoneFrame = (props) => {
      return (
        <div className="text-center">
        <h2>{props.doneStatus}</h2>
        <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
        </div>
      );
    };


    // We declare the generation of the numbers from 1-9 outside the component
    //so it does not change everytime we change a subcomponent
    //NOTICE: How this is declaration is below the component and not above.
    //Might be that in the life cycle it is generated first and the component migt be used after we call the class component Game.
    Numbers.list = _.range(1,10);

    //Component: Game
    class Game extends React.Component{

      //thanks so Babel.js
      static randomNumber = () => 1 + Math.floor(Math.random()*9);
      static initialState = () => ({
        selectedNumbers :[],
        randomNumberOfStars: Game.randomNumber(),
        usedNumbers : [],
        answerIsCorrect: null,
        redraws:5,
        doneStatus: null,
      });

      // decalring the state variable in the game components
      // as it will be used in the Anwers,  Numbers  and other subcomponents
      state = Game.initialState();
      //resetGame = () =>{ this.setState (Game.initialState());}
      //The previous lines could be reduced by an arrow function
      resetGame = () => this.setState (Game.initialState());
      // this.state.xxxx makes use of the variable
      // this.setState ( assigns values to the state (it could be static or to initialize)
      // this.setState (prevState => xxxx assigns a new value to the state based on previous states functionality (like recursive)

      // It sems that this is the click dynamic event which:
      //1. variable depends in a the argument passed (clickNumber)
      //2. Based on that it sets a satate
      selectNumber = (clickedNumber) => {

        //If the state of selected numbers already have the one we clicked, do not send the number again to the subcomponents
        // that will avoid re-visualizing the number in the Numbers subcomponents
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0)
        {return;}

        //otherwise if it is not in the selectedArrays number do send it to as a variable(number) to the subcomponents
        // that will visualizing the number in the Numbers subcomponents
        this.setState (
          prevState => ({
            answerIsCorrect : null,
            selectedNumbers:prevState.selectedNumbers.concat(clickedNumber)
          })
        );
      };

      unselectNumber = (clickedNumber) => {
        //The declarative way to remove an array in javascript is with filter
        this.setState (
          prevState => ({
            answerIsCorrect : null,
            selectedNumbers:prevState.selectedNumbers.filter(number => number !== clickedNumber)
          })
        );
      };

      //Function that checks if the selected numbers are the numbers of stars rendered
      checkAnswer = () =>
      {
        this.setState(
          prevState =>({
            answerIsCorrect : prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc,n) => acc + n, 0)
          })
        );
      };

      //Function: Valid Answer. Set the state in the conditions to start agin a new selection to carry on with the name
      acceptAnswer = () => {
        this.setState(
          prevState =>({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            randomNumberOfStars: Game.randomNumber()
          })
          , this.updateDoneStatus
        );
      };

      //Function: Refresh. Set the state in the conditions to start agin a new selection to carry on with the name
      // with the differnece that we do not concat usedNumbers and reduce the counter of redraws
      redraw= () => {
        if (this.state.redraws === 0 ) {return 0;}
        this.setState(
          prevState => ({
            selectedNumbers: [],
            answerIsCorrect: null,
            randomNumberOfStars: Game.randomNumber(),
            redraws : prevState.redraws-1,
          }), this.updateDoneStatus);
        };


        possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
          const possibleNumbers= _.range(1,10).filter(number =>
            usedNumbers.indexOf(number) === -1
          );

          return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
        };

        updateDoneStatus = () => {
          this.setState (prevState => {
            if(prevState.usedNumbers.length === 9)
            {
              return {doneStatus: ' Done Nice!!' };
            }
            if (prevState.redraws ===0 && !this.possibleSolutions(prevState))
            {
              return {doneStatus: 'Game Over'};
            }
          });
        };



        // The important part of the Game where we set the state and its components to render
        render(){

          const {
            selectedNumbers,
            randomNumberOfStars,
            usedNumbers,
            answerIsCorrect,
            redraws,
            doneStatus
          }= this.state;

          {/*the state is just keeping the values of the variables, this.xxx are the actions on each component */}
          return (
            <div className="container">
            <h3>Play Nine</h3>
            <hr />
            <div className="row">
            <Stars numberOfStars={randomNumberOfStars}/>
            <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            redraw={this.redraw}
            redraws={redraws}
            answerIsCorrect={answerIsCorrect}/>
            <Answer selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber}/>
            </div>
            <br />
            {/*if conditional*/}
            {
              doneStatus ?
              <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} />
              :
              <Numbers selectedNumbers={selectedNumbers}
              selectNumber={this.selectNumber}
              usedNumbers={usedNumbers}/>
            }
            </div>
          );
        }
      }


      //Class where we render more classes.
      //It is usually a good practice to separate at this level in case we need to add libraries and more components.
      class App extends React.Component{
        render(){
          return(
            <div>
            <Game />
            </div>
          );  }
        }


        ReactDOM.render (<App />, container);
