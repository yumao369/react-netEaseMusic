# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

summary:
1.Restart the project after adding .env file,or it may not work.
2.Having services in project.
3.notice that some HTML tags have user agent stylesheet.
4.scroll https://www.robinwieruch.de/react-scroll-to-item/
5.Do not call hooks inside loops,or you will get an error.look at the article attached below to learn about this problem.https://stackoverflow.com/questions/53472795/uncaught-error-rendered-fewer-hooks-than-expected-this-may-be-caused-by-an-acc

still need to work:
1.the styles of header at home page.
2.the styles of dots of carousel at home page.
3.resolve
4.optional chaining (?.) Parsing error: Expression expected.eslint(solved by re-installiing eslint in version 7.5.0 can compile successfully,but still have this problem in the code.Check this problem in wyPlayer component.)

obstacles:
1.How to deal with the less styles,as the less modules in react has an unique global variable name,but for some styles,I want to use the same classname everywhere.
2.how to add resolve to ensure that the components are loaded after the data is loaded every time, so as to avoid empty components that affect the user experience.
3.How to set state in observable of fromEvent,cause every time I set state when I subscribe the observable,the component will be rerendered,unsubscribing from observables.
4.how to get the value of [(ngmodel)] in child component in angular.You can see the proble in wy-player component.
5.if you pass a state from parent to child and use this state in observables,data will not change if you don't unsubscribe this observable.

solutions: 1.https://dev.to/codeprototype/configuring-both-css-modules-and-global-css-for-reactjs-in-webpack-4ci7
https://angular.io/guide/view-encapsulation#inspect-generated-css
for example:in component wyCarousel,for the second div,we need it to be displayed as a wrap.We already have .wrap class that could be used every,but we have some unique styles for this particular wrap,so we can make it possibel like what I have done.
3.add a dependency to useeffect hook.Please look at the questions I asked at stack overflow and WySlider component in this project.
4.use ControlvalueAccessor.Look at this artical and answer one https://stackoverflow.com/questions/41350584/angular2-pass-ngmodel-to-a-child-component .Look at this example of how to simply use ngmodel and controvalueaccessor https://github.com/yumao369/angularTest
5.You can find this instance in wyPlayer and wySlider.There is a simple example of how this means.https://codesandbox.io/s/green-resonance-w4dsh8?file=/src/App.js . When you click the number of this example,the number will be added by 1.Then if you click bbb,you will see the latest number in the console.If you click ccc,you will see the initial number.
