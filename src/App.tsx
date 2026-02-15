import { setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './index.css';

import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Hipopressives from './pages/Hipopressives';
import ExerciseSession from './pages/ExerciseSession';
import KegelLanding from './pages/KegelLanding';
import KegelSession from './pages/KegelSession';
import Settings from './pages/Settings';

setupIonicReact();

const USER_NAME_KEY = 'user_name';

const App: React.FC = () => {
    const hasName = !!localStorage.getItem(USER_NAME_KEY);

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/welcome">
                        <Welcome />
                    </Route>
                    <Route exact path="/home">
                        <Home />
                    </Route>
                    <Route exact path="/hipopressives">
                        <Hipopressives />
                    </Route>
                    <Route path="/hipopressives/session/:level">
                        <ExerciseSession />
                    </Route>
                    <Route exact path="/kegel">
                        <KegelLanding />
                    </Route>
                    <Route exact path="/kegel/session/:level">
                        <KegelSession />
                    </Route>
                    <Route exact path="/settings">
                        <Settings />
                    </Route>
                    <Route exact path="/">
                        <Redirect to={hasName ? '/home' : '/welcome'} />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
