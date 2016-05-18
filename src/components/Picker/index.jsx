
import React, { Component } from 'react';

const Toggle = ({ name, label, value, tellValue }) => {
    let btnType = value ? 'btn-primary' : 'btn-default';

    return (
        <button className={`btn btn-large ${btnType}`}
                onClick={() => tellValue(name, !value)}>
            {label}
        </button>
    );
};

const Picker = ({ options, onPick, picked }) => (
    <div style={{display: 'inline-block'}}>
        {options.map((opt) => (
            <Toggle label={opt}
                    key={opt}
                    name={opt}
                    value={opt == picked}
                    tellValue={(key, v) => v ? onPick(opt) : null} />
        ))}
    </div>
);

export default Picker;
