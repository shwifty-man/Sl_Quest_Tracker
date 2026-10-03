import { useEffect, useState } from "react";
import { Text } from "react-native";

import { questDetailsStyles } from "../../Styles/questDetailsStyles"

function CountdownTimer({ deadline, isCompleted }) {
    const getRemaining = () => {
        if (!deadline) return 0;

        return Math.max(
            0,
            new Date(deadline).getTime() - Date.now()
        );
    };

    const [remaining, setRemaining] = useState(getRemaining);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(getRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    const totalSeconds = Math.floor(remaining / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );
    const seconds = totalSeconds % 60;

    return (
        <Text style={[questDetailsStyles.timeValue, { color: isCompleted ? '#22C55E' : '#19C7FF' }]}>
            {hours}h {String(minutes).padStart(2, "0")}m{" "}
            {String(seconds).padStart(2, "0")}s
        </Text>
    );
}

export default CountdownTimer;