import { css } from '@emotion/css'
import App from '@/component/ripple/App'

export default function Water() {
    return (
        <div className={styles.container}>
            <App />
        </div>
    )
}

const styles = {
	container: css`
		position: relative;
		width: 100vw;
		height: 100vh;
    padding: 0;
    margin: 0;
	`
}
