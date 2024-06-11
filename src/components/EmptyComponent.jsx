import React, { Component } from 'react'
import contactAnimationData from '../assets/lotties/empty.json'
import Lottie from 'react-lottie';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: contactAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default function EmptyComponent({ message }) {
    return (
        <div style={{
            alignSelf: 'center',
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10rem 0 0 0 ",
            width: '80vw'
        }}>
            <Lottie options={defaultOptions} width={200} />
            {message}
        </div>
    )
}
