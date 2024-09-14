import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function ServerErrorPage(props) {
    return ( 
        <div>
            <p>Connection failed</p>
            <button onClick={props.reload} >Try again</button>
        </div>
    )
}