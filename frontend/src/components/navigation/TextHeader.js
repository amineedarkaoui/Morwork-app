import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import {useNavigate} from 'react-router-dom'


export default function TextHeader(props) {
    const navigate = useNavigate()
    return (
        <header className="text-header elevation-1">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBack />
            </IconButton>
            <p className="large-title">{props.title}</p>
        </header>
    )
}