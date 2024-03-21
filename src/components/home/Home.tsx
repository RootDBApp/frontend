import * as React from 'react';

import DirectoriesListing from "./DirectoriesListing";

const Home: React.FC = (): React.ReactElement => {

    return <div id="home" className="expand-vertically"><DirectoriesListing/></div>
}

export default Home;
