import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Graph from "./graphMerge.jsx";
import Code from "./code.jsx";

const Merge = (props) => {
    let {
        array,
        setArray,
        content,
        setContent,
        animationArray,
        setAnimationArray,
        time,
        status,
        setStatus,
        color,
        setColor,
        newColor,
        position,
        setPosition,
        newPosition,
        oldPosition,
        setOldPosition,
        stopInterval,
        doing,
        changeDoing,
        firstTime,
        changeFirstTime,
    } = props.data;
    let {
        arrayIndex,
        setArrayIndex,
        initialArrayIndex,
        setInitialArrayIndex,
    } = props.mergeData;

    const [range, setRange] = useState([0, 16]);
    const [mid, setMid] = useState([]);

    //push,原本index,新index
    const mergeSort = (array, startIndex) => {
        let arr = [...array];
        if (animationArray.length != 0) {
            animationArray.push([
                "range",
                startIndex,
                startIndex + arr.length - 1,
            ]);
        }
        if (arr.length < 2) {
            animationArray.push([
                "back",
                startIndex,
                startIndex + arr.length - 1,
            ]);
            return arr;
        }
        let index = startIndex;
        let mid = Math.floor(arr.length / 2);
        animationArray.push(["mid", startIndex, mid]);
        let left = mergeSort(arr.slice(0, mid), index);
        let right = mergeSort(arr.slice(mid), mid + index);

        let result = [];
        while (left.length > 0 && right.length > 0) {
            animationArray.push(["com", left[0][0], right[0][0]]);
            if (right[0][1] < left[0][1]) {
                animationArray.push(["small", right[0][0], left[0][0]]);
                let temp = [index, right[0][1]];
                result.push(temp);
                animationArray.push(["push", right[0][0], index]);
                right.shift();
            } else {
                animationArray.push(["small", left[0][0], right[0][0]]);
                let temp = [index, left[0][1]];
                result.push(temp);
                animationArray.push(["push", left[0][0], index]);
                left.shift();
            }
            index++;
        }
        if (left.length > 0) {
            left.forEach((element) => {
                let temp = [index, element[1]];
                result.push(temp);
                animationArray.push(["push", element[0], index]);
                index++;
            });
            animationArray.push([
                "back",
                startIndex,
                startIndex + arr.length - 1,
            ]);
        } else if (right.length > 0) {
            right.forEach((element) => {
                let temp = [index, element[1]];
                result.push(temp);
                animationArray.push(["push", element[0], index]);
                index++;
            });
            animationArray.push([
                "back",
                startIndex,
                startIndex + arr.length - 1,
            ]);
        } else {
            animationArray.push([
                "back",
                startIndex,
                startIndex + arr.length - 1,
            ]);
        }
        return result;
    };

    const code = [
        "從中間將陣列分成兩半，分別為 Left 及 Right\nmid = array.length/2",
        "各自進行 Merge Sort ，直到陣列只有一個數字\nleft = mergeSort(array[0~mid-1])\nright = mergeSort(array[mid~])",
        "\t比較 Left 及 Right 的第一個數字\n\tcompare left[0] & right[0]",
        "\t\t將小的數字從 Left(Right) 移至 Result\n\t\tresult.push(smaller)",
        "\t將這次 Merge Sort 的 Result 回傳\n\treturn result",
    ];
    let colorCode = [];
    for (let i = 0; i < code.length; i++) {
        colorCode.push("#000000");
    }
    const [currentCode, setCurrentCode] = useState(colorCode);

    const reSort = (arrIndex) => {
        let arr = [...arrIndex];
        arr = arrIndex.sort((a, b) => a[0] - b[0]);
        return arr;
    };

    const doAniMer = (animationArray, arrayIndex, index) => {
        let barSpace = 50;
        let barWidth = 25;
        let svgWidth = window.innerWidth * 0.85 * 0.7 - 2;
        if (array.length * barSpace + 100 > svgWidth) {
            barSpace = (svgWidth * 0.9) / array.length;
            barWidth = barSpace * 0.65;
        }
        let xOuter = (svgWidth - array.length * barSpace) / 2;

        let arr = [...arrayIndex];
        window.index = index;
        let text;
        for (let i = 0; i < arr.length; i++) {
            status[i] = "null";
        }
        window.ani = setInterval(() => {
            let ele = animationArray[window.index];
            if (ele[0] == "range") {
                let pos = [...position];
                for (let i = ele[1]; i <= ele[2]; i++) {
                    pos[i].y += 130;
                }
                // setOldPosition(position);
                setPosition(pos);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                setCurrentCode(temp);
            } else if (ele[0] == "mid") {
                setMid([ele[1], ele[2]]);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[0] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "small") {
                status[ele[1]] = "small";
                status[ele[2]] = "big";
                setColor(newColor(arr, status));

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "back") {
                arr = reSort(arr);
                setArrayIndex(arr);

                let pos = [...position];

                for (let i = 0; i < array.length; i++) {
                    pos[i].x =
                        i * barSpace + xOuter + (barSpace - barWidth) / 2;
                    if (i >= ele[1] && i <= ele[2]) {
                        pos[i].y -= 130;
                        if (
                            animationArray[window.index - 1][0] != "range" &&
                            window.index != animationArray.length - 1
                        ) {
                            pos[i].y -= 130;
                        }
                    }
                    pos[i].y =
                        Math.floor(pos[i].y / 130) * 130 + 130 - arr[i][1];
                }
                // setOldPosition(position);
                setPosition(pos);

                for (let i = 0; i < arr.length; i++) {
                    status[i] = "null";
                }
                setColor(newColor(arr, status));
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[4] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "com") {
                for (let i = 0; i < arr.length; i++) {
                    status[i] = "null";
                }
                status[ele[1]] = "com";
                status[ele[2]] = "com";
                setColor(newColor(arr, status));
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[2] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "push") {
                arr[ele[1]][0] = ele[2];
                setArrayIndex(arr);

                let pos = [...position];
                pos[ele[1]].x =
                    ele[2] * barSpace + xOuter + (barSpace - barWidth) / 2;
                pos[ele[1]].y += 130;
                // setOldPosition(position);
                setPosition(pos);
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);
            }

            window.index++;

            if (window.index >= animationArray.length) {
                for (let i = 0; i < arr.length; i++) {
                    status[i] = "sorted";
                }
                setColor(newColor(arr, status));
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                setCurrentCode(temp);
                setContent("排序完成。");
                clearInterval(window.ani);
            }
        }, time);
    };

    const stepAniMer = (animationArray, arrayIndex, index) => {
        let barSpace = 50;
        let barWidth = 25;
        let svgWidth = window.innerWidth * 0.85 * 0.7 - 2;
        if (array.length * barSpace + 100 > svgWidth) {
            barSpace = (svgWidth * 0.9) / array.length;
            barWidth = barSpace * 0.65;
        }
        let xOuter = (svgWidth - array.length * barSpace) / 2;

        let arr= [...arrayIndex];
        setArrayIndex(arr);
        // setPosition(oldPosition);

        let pos = [...oldPosition];
        //上下層???

        let statusTemp = [];
        for (let i = 0; i < array.length; i++) {
            statusTemp.push("null");
        }
        setColor(newColor(arr, statusTemp));
        // setContent("Click Start!");

        let final = index;
        if (final == animationArray.length + 1) {
            final = animationArray.length;
        }

        for (let stepIndex = 0; stepIndex < final; stepIndex++) {
            let ele = animationArray[stepIndex];
            if (ele[0] == "range") {
                for (let i = ele[1]; i <= ele[2]; i++) {
                    pos[i].y += 130;
                }
                // setOldPosition(pos);
                // setPosition(pos);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                setCurrentCode(temp);
            } else if (ele[0] == "mid") {
                setMid([ele[1], ele[2]]);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[0] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "small") {
                statusTemp[ele[1]] = "small";
                statusTemp[ele[2]] = "big";
                setColor(newColor(arr, statusTemp));

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "back") {
                arr = reSort(arr);
                setArrayIndex(arr);

                // let pos = [...position];
                for (let i = 0; i < array.length; i++) {
                    pos[i].x =
                        i * barSpace + xOuter + (barSpace - barWidth) / 2;
                    if (i >= ele[1] && i <= ele[2]) {
                        pos[i].y -= 130;
                        if (
                            animationArray[stepIndex - 1][0] != "range" &&
                            stepIndex != animationArray.length - 1
                        ) {
                            pos[i].y -= 130;
                        }
                    }
                    pos[i].y =
                        Math.floor(pos[i].y / 130) * 130 + 130 - arr[i][1];
                }
                // setOldPosition(pos);
                // setPosition(pos);

                for (let i = 0; i < arr.length; i++) {
                    statusTemp[i] = "null";
                }
                setColor(newColor(arr, statusTemp));
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[4] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "com") {
                for (let i = 0; i < arr.length; i++) {
                    statusTemp[i] = "null";
                }
                statusTemp[ele[1]] = "com";
                statusTemp[ele[2]] = "com";
                setColor(newColor(arr, statusTemp));
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[2] = "#ff0000";
                setCurrentCode(temp);
            } else if (ele[0] == "push") {
                arr[ele[1]][0] = ele[2];
                setArrayIndex(arr);

                // let pos = [...position];
                pos[ele[1]].x =
                    ele[2] * barSpace + xOuter + (barSpace - barWidth) / 2;
                pos[ele[1]].y += 130;
                // setOldPosition(pos);
                // setPosition(pos);
                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);
            }
        }

        if (index >= animationArray.length) {
            for (let i = 0; i < arr.length; i++) {
                statusTemp[i] = "sorted";
            }
            setColor(newColor(arr, statusTemp));
            let temp = [...colorCode];
            for (let i = 0; i < code.length; i++) {
                temp[i] = "#000000";
            }
            setCurrentCode(temp);
            setContent("排序完成。");
        }
        setStatus(statusTemp);
    };

    const graph = {
        arrayIndex,
        position,
        oldPosition,
        color,
        content,
        code,
        currentCode,
        range,
        mid,
    };
    return (
        <div className="main">
            <div className="graph-code">
                <Graph graph={graph} />
                <Code code={code} currentCode={currentCode} />
            </div>
            <div className="animation-control">
                <div
                    onClick={() => {
                        if (doing == false && firstTime) {
                            changeDoing(true);
                            changeFirstTime(false);
                            mergeSort(arrayIndex, 0);

                            for (let i = 0; i < array.length; i++) {
                                status[i] = "null";
                            }
                            doAniMer(animationArray, arrayIndex, 0);
                        } else if (doing == false) {
                            changeDoing(true);
                            doAniMer(animationArray, arrayIndex, window.index);
                        }
                    }}
                >
                    Start
                </div>
                <div
                    onClick={() => {
                        if (doing == true) {
                            changeDoing(false);
                            stopInterval();
                        }
                    }}
                >
                    Pause
                </div>
                <div
                    onClick={() => {
                        changeDoing(false);
                        changeFirstTime(true);
                        stopInterval();
                        window.index = 0;
                        stepAniMer(animationArray, initialArrayIndex, window.index);
                    }}
                >
                    Reset
                </div>
                <div
                    onClick={() => {
                        window.index--;
                        if (window.index < 0) {
                            window.index = 0;
                        }
                        stepAniMer(animationArray, initialArrayIndex, window.index);
                    }}
                >
                    Previous
                </div>
                <div
                    onClick={() => {
                        window.index++;
                        if (window.index > animationArray.length) {
                            window.index = animationArray.length + 1;
                        }
                        console.log(position);
                        console.log(oldPosition);
                        stepAniMer(animationArray, initialArrayIndex, window.index);
                        console.log(position);
                        console.log(oldPosition);
                    }}
                >
                    Next
                </div>
                <div>Speed</div>
            </div>
            <div className="control-button">
                <div
                    className="sort"
                    onClick={() => {
                        if (doing == true) {
                            changeDoing(false);
                            stopInterval();
                        }
                    }}
                >
                    Pause
                </div>
                <div
                    className="sort"
                    onClick={() => {
                        if (doing == false && firstTime) {
                            changeDoing(true);
                            changeFirstTime(false);
                            mergeSort(arrayIndex, 0);

                            for (let i = 0; i < array.length; i++) {
                                status[i] = "null";
                            }
                            doAniMer(animationArray, arrayIndex, 0);
                        } else if (doing == false) {
                            changeDoing(true);
                            doAniMer(animationArray, arrayIndex, window.index);
                        }
                    }}
                >
                    Start
                </div>
            </div>
        </div>
    );
};

export default Merge;
