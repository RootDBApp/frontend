import Transition           from 'react-transition-group/Transition';
import React, { ReactNode } from "react";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    width: 0,
    height: 0,
}

const transitionStyles: any = {
    entering: {opacity: 1, width: '100%', height: '100%'},
    entered: {opacity: 1, width: '100%', height: '100%'},
};

const Fade: React.FC<{ in: boolean, children: ReactNode, className?: string }> = ({in: inProp, children, className}) => (
    <Transition in={inProp} timeout={duration}>
        {(state) => (
            <div
                className={className}
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
            >
                {children}
            </div>
        )}
    </Transition>
);

export default Fade;