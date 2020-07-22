import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Graph from "./graph.jsx";

const Insertion = (props) => {
    let {
        array,
        setArray,
        content,
        setContent,
        time,
        status,
        setStatus,
        color,
        setColor,
        newColor,
        position,
        setPosition,
        newPosition,
        stopInterval,
        doing,
        changeDoing,
        firstTime,
        changeFirstTime,
    } = props.data;

    // const [major, setMajor]= useState(-1);
    let major = -1;
    const positionInsert = (array) => {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            let temp = 130 - array[i];
            let tempx = (900 - array.length * 50) / 2;
            if (i == major) {
                temp = 230 - array[i];
            }
            result.push({
                x: i * 50 + tempx,
                y: temp,
            });
        }
        return result;
    };
    // useEffect(() => {
    //     let arr = [
    //         45,
    //         72,
    //         17,
    //         55,
    //         90,
    //         32,
    //         48,
    //         23,
    //         66,
    //         99,
    //         12,
    //         62,
    //         34,
    //         84,
    //         10,
    //         70,
    //     ];
    //     setArray(arr);
    //     setPosition(newPosition(arr));
    //     console.log(positionInsert(arr));
    //     for(let i = 0; i <arr.length; i++){
    //         status[i] = "null";
    //     }
    //     setColor(newColor(arr, status));
    //     // setPosition(positionInsert(arr));
    // }, []);

    useEffect(() => {
        setPosition(positionInsert(array));
    }, [major]);

    const code = [
        "從第二個數字開始當主要Key\nfor i from 0 to array's length (Key)",
        "\t向前依序比較，找尋適當位置\n\tfor j from i-1 to 0 (Compare)",
        "\t\t若Key小於前一個數，向前移動\n\t\tif Key < Compare\n\t\t\tSwap Key and Compare",
        "\t\tKey大於前一個數，放置於此\n\t\telse if Key > Compare\n\t\t\tBreak",
    ];
    let colorCode = [];
    for (let i = 0; i < code.length; i++) {
        colorCode.push("#000000");
    }
    const [currentCode, setCurrentCode] = useState(colorCode);

    const insertionSort = (array) => {
        let arr = [...array];
        let ani = [];
        for (let i = 1; i < arr.length; i++) {
            ani.push(["major", i]);
            for (let j = i - 1; j >= 0; j--) {
                //Compare key and elements before key
                ani.push(["com", j, j + 1]);
                if (arr[j] > arr[j + 1]) {
                    ani.push(["push", j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                } else {
                    ani.push(["stop", j, j + 1]);
                    break;
                }
                if (j == 0) {
                    ani.push(["min", j]);
                }
                // ani.push(["stop", j, j + 1]);
            }
        }
        return ani;
    };

    // const ani;
    const doAniIns = (animat, array, index) => {
        let arr = [...array];
        window.index = index;
        let text;
        // for (let i = 0; i < arr.length; i++) {
        //     status[i] = "null";
        // }
        let m;
        let mNum;
        let minIndex;
        window.ani = setInterval(() => {
            let ele = animat[index];

            if (ele[0] == "com") {
                //key & elements before key until find its position
                for (let i = 0; i < ele[1]; i++) {
                    status[i] = "after";
                }
                status[ele[1]] = "com";
                status[ele[2]] = "com";
                text = `${m} 比較 ${arr[ele[1]]} 與 ${arr[ele[2]]}。`;
                setContent(text);
                if (index > 1) {
                    if (ele[2] < animat[index - 1][2]) {
                        status[animat[index - 1][1]] = "com";
                        status[animat[index - 1][2]] = "after";
                    }
                }

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[1] = "#ff0000";
                setCurrentCode(temp);

                setPosition(positionInsert(arr));
                setColor(newColor(arr, status));
                // console.log('com'+major);
            } else if (ele[0] == "push") {
                //left one should wait for next compare
                //right one should be after
                text = `${m}，${arr[ele[1]]} > ${arr[ele[2]]}，將 ${
                    arr[ele[1]]
                } 與 ${arr[ele[2]]} 互換。`;
                setContent(text);
                major -= 1;
                [arr[ele[1]], arr[ele[2]]] = [arr[ele[2]], arr[ele[1]]];
                setPosition(positionInsert(arr));

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[2] = "#ff0000";
                setCurrentCode(temp);

                status[ele[1]] = "com";
                status[ele[2]] = "after";
                setArray(arr);
                // setMajor(temp);
                setColor(newColor(arr, status));
                // console.log('push'+major);
            } else if (ele[0] == "big") {
                status[ele[1]] = "small";
                status[ele[2]] = "big";
                text = `${m} ${arr[ele[2]]} > ${arr[ele[1]]}，互換。`;
                setContent(text);

                setColor(newColor(arr, status));
                // console.log('big'+major);
            } else if (ele[0] == "major") {
                //key highlight
                for (let i = 0; i < ele[1]; i++) {
                    status[i] = "after";
                }
                status[ele[1]] = "key";
                major = ele[1];
                // setMajor(ele[1]);
                m = `${arr[ele[1]]} 為 key。`;
                mNum = arr[ele[1]];
                minIndex = ele[1];

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[0] = "#ff0000";
                setCurrentCode(temp);

                setContent(m);
                setColor(newColor(arr, status));
                // console.log('major'+major);
            } else if (ele[0] == "stop") {
                text = `${m} Key ${arr[ele[2]]} > ${arr[ele[1]]}，放回陣列。`;
                setContent(text);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);

                major = -1;
                setPosition(positionInsert(arr));
            } else if (ele[0] == "min") {
                text = `${m} Key ${arr[ele[1]]} 為最小值，放回陣列。`;
                setContent(text);

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                temp[3] = "#ff0000";
                setCurrentCode(temp);

                major = -1;
                setPosition(positionInsert(arr));
            }
            index++;

            if (index == animat.length) {
                clearInterval(ani);
                for (let i = 0; i < arr.length; i++) {
                    status[i] = "after";
                }

                let temp = [...colorCode];
                for (let i = 0; i < code.length; i++) {
                    temp[i] = "#000000";
                }
                setCurrentCode(temp);

                setColor(newColor(arr, status));
                setContent("排序完成。");
                // setMajor(-1);
                major = -1;
                setPosition(positionInsert(arr));
            }
        }, time);
    };

    const graph = {
        array,
        position,
        color,
        content,
        code,
        currentCode,
    };

    return (
        <div>
            <div
                className="sort"
                onClick={() => {
                    if (doing == false && firstTime) {
                        changeDoing(true);
                        changeFirstTime(false);
                        let ani = insertionSort(array);
                        for (let i = 0; i < array.length; i++) {
                            status[i] = "null";
                        }
                        doAniIns(ani, array, 0);
                    }
                }}
            >
                Insertion Sort
            </div>
            <Graph
                graph={graph}
                // colorCode1={colorCode1}
                // colorCode2={colorCode2}
            />
        </div>
    );
};

export default Insertion;