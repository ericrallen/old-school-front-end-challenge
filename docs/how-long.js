(function () {
  const APPOINTMENT_LENGTH = 30;

  const calculate = document.getElementById("calculate");
  const results = document.getElementById("results");
  const bigNumbers = document.getElementById("big-numbers");
  const reallyBigNumbers = document.getElementById("really-big-numbers");
  const clear = document.getElementById("clear");

  const lotsOfNames = `Veronica Klein Marco Quintero Keyla Wilkerson Carmelo Hoover Virginia Bruce Uriah Conner Alondra Lyons Cyrus Fowler Lennon Lim Cal Stanton Jaycee Williams Oliver Glenn Blaire Norton Callen Hurley Rylan Flowers Saul Chandler Viviana Jenkins Declan Summers Frankie Valencia Dax White Layla Middleton Misael Hubbard Rosie Hahn Kabir David Haylee Krueger Jones McIntosh Gwen Bentley Randy Lane Amy May Finley Sampson Meilani Simmons Harrison Mason Sienna Cortez Zayn Summers Frankie Harding Brodie Stevenson Regina Mendoza Dominic Chandler Viviana Galvan Kingsley Hunt Genevieve Wiley Mathew Farrell Kassidy Pacheco Erik Portillo Nathalie McDonald Calvin Huerta Dulce Franklin Simon Krueger Kamari Cooper Jonathan Novak Kaiya Wilkins Yusuf Beil Itzel Gillespie Forest Gould Violeta Herrera River Wilcox Ashlyn Wheeler Kenneth Sims Lena Rich Miller Trujillo Danielle Preston Vincenzo Rasmussen Esperanza Dominguez Kaden Maldonado Elaina Jones William Bean Jenesis Rubio Titan McIntyre Rebekah Martin Mateo Skinner Mara Cano Terry Wiley Lauryn Bates Ellis Martinez Harper Lester Lee Russo Tinsley Boyd Dean Hickman Scarlette Townsend Alexis Welch Amira Reed Easton Macias Adley Drake Jalen Winters Kataleya Meadows Wayne Graves Elle Lindsey Jayson Caldwell Evelynn Rios Israel Smith Olivia Ellis Cole Kim Gabriella Wheeler Kenneth Li Paige Richmond Mordechai Kent Jazmine Lyons Cyrus Hensley Malaya Alvarado Andres Holland Mariah Correa Zakai Grant Alaina Hurst Neil Lara Heidi Guerrero Bryce Rojas Adaline Beasley Stanley Novak Kaiya Salazar Brody Stein Leilany Chandler Royal Kim Gabriella Marsh Bo McKay Leanna Mathis Gustavo Ibarra Madilynn Mayo Jericho Yu Navy Moses Niklaus Bonilla Romina Franco Gage Person Dylan Hunt Jesus Andrews Payton Chambers Orion Duran Willa Hebert Guillermo Summers Frankie Hinton Frankie White Layla Blankenship Ernesto Phelps Laney Ponce Langston Townsend Azalea Harper Hayes Kramer Hanna Campos Gideon Juarez Juliet Thompson Theodore Dawson Veronica Carr Kash Singh Vivienne Fry Jacoby Hubbard Rosie Sherman Adan Frost Paula Zuniga Sincere Sherman Addilyn Nash Chandler Summers Frankie Weaver Tucker Whitehead Sylvie Castillo Kai Gill Jordan Liu Pedro Singleton Malaysia Stephens Messiah Castillo Eva Waters Maximilian Nicholson Justice Yang Malcolm Bush Everlee Wheeler Kenneth Madden Violette Arnold Abraham Beasley Jaylah Herrera River Ball Abby Dyer Atreus Pineda Nola Curtis Muhammad Roman Astrid Esparza Carl Abbott Melany Sandoval Brantley Weiss Lennox Howard Jeremiah Oliver Camille Osborne Augustus York Milan Hutchinson Korbin Briggs Alia Pratt Rowen Ashley Khalani Garrett Kairo Drake Jayleen Murphy Cameron Maddox Zainab Rivers Bear Delacruz Celine Ayala Tanner Porter Ryleigh Sellers Madden Lopez Gianna Wolfe Donovan Johnston Laila Payne Edward Black Molly Delacruz Memphis Cortes Lea Strickland Keegan Castro Eloise King Julian Heath Amani Pacheco Erik Morton Mallory Galvan Kingsley Vang Madisyn Boone Mauricio Meza Rosa Molina Prince Pope Aurelia Andersen Alistair Thornton Haisley Estrada Phoenix Green Zoe Pierce Nicolas Washington Valerie Clay Yosef Trujillo Danielle Parks Gianni Guerra Edith Payne Edward Vo Artemis Cohen Killian McCann Joyce Wall Issac Davila Rayne Reeves Clark Gillespie Alianna Mack Esteban Gilmore Chanel Morrison Maximus Conley Salem Daniels Xander Medrano Halle Marks Amos Palmer Juniper Dean Ronan Tanner Harmoni Armstrong Grant Delacruz Celine Smith Liam Vega Dakota Lane Matias Howe Persephone Melendez Nikolas Huerta Dulce Warner Jaxton Moses Karter Watkins Nash Silva Lucia Sims Brian Fowler Lennon Grant Leon Santana Myra Hester Rene Herrera Ximena Mueller Albert Wilson Luna Floyd Pierce Blackburn Frida Meza Lucian Vaughn Reign Robinson Matthew Hutchinson Jamie Blanchard Adler Hail Lainey Burgess Kolton Blevins Aila Roth Roy Correa Valery Maddox Lyric Thomas Elizabeth Pittman Valentino Thomas Elizabeth Bullock Ben Atkinson Jazmin Andersen Alistair Nielsen Vienna Andrade Abdiel McIntyre Rebekah Ellis Cole Villarreal Jazlyn Yates Braylon Beasley Jaylah Galvan Kingsley Washington Valerie Atkins Cason Villarreal Jazlyn Reilly Alvaro Hoover Virginia Lowery Jaxxon Marks Monica Strong Axl Bowman Fiona Doyle Kashton Marshall Adalyn Sullivan Evan Dean Julianna Robles Otto Wheeler Sydney Ponce Langston Schaefer Mavis Holt Niko Hardin Vada Nielsen Tru Parker Aubrey Combs Ahmad Kline Sevyn Lloyd Zaire Trujillo Danielle Quinn Rhys Beard Ezra Villalobos Reuben Hardy Jessica Guerra Leland Li Paige Fleming Fernando Allen Riley Acosta Jensen Monroe Carly Huang Ayaan McKee Kori Arias Alec Bradley Vanessa Lim Cal Strong Margo Horton Garrett Beard Ezra Strong Axl Dalton Lilian Stephenson Joe Harper Ana Brady Reed Garrison Cadence Castro Jasper Buck Livia Huffman Chris Kline Sevyn Weeks Anders Portillo Nathalie Hinton Frankie Simon Kalani Riley Amari Macias Adley Juarez Joaquin Summers Frankie Small Rudy Ibarra Madilynn McLean Crosby Tanner Harmoni Baxter Tomas Valencia Maddison Cortes Banks Erickson Sabrina Logan Rocco Ruiz Emery Meadows Wayne McGuire April Massey Donald Coffey Paola McCann Heath Dominguez Raegan Butler Ryder Gallagher Elliott McGee Conner Sloan Selene Conrad Dilan Bowers Elisa Estes Hakeem Huang Francesca Jacobson Legacy Hunter Khloe Dunlap Aries Mayer Ainhoa Stout Callahan Rice Ada Charles Conrad Gregory Alaya Spencer Ace Woodward Drew Valentine Demetrius Gilbert Jocelyn Valencia Dax Dixon Blakely Cline Cullen Rosario Louisa Boyer Zeke Ramos Alice Chase Otis Ayala Blair Conrad Dilan Lucero Ila Watkins Nash Fischer Maci Rowe Kamden Patel Madeline Gibbs Deacon Lyons Kenzie Hickman Jakobe Henry Summer Castro Jasper Hebert Kyleigh Chandler Royal Hogan Kathryn Dominguez Kaden Thornton Haisley Preston Vincenzo Frederick Sariyah Beck Eduardo Harrison Jasmine Robertson Emiliano Miles Alessandra Krueger Jones McKee Kori Blanchard Adler Floyd Yaretzi Vance Casen Armstrong Presley Morse Bode Velez Megan Blake Zyaire Arellano Faye Aguilar Milo Barajas Keilani Hamilton Jason Blake Amanda Fuller Andre Sosa Cassandra Bernal Eithan Murillo Mikaela Marsh Bo Garrett Tessa Sellers Madden Roy Savanna Simmons Harrison Crosby Keily Foster Kayden Gilmore Chanel Summers Darius Alvarado Blake Acevedo Dakari Glover Alessia Juarez Joaquin Bowen Dream Marin Aldo Curry Alison Giles Kole Doyle Annalise Ruiz Austin Vazquez Journee Chung Ira Farrell Kassidy Sandoval Brantley Roberts Paisley Turner Joshua Hart Gemma Stevens Zachary Hensley Malaya Vo Gordon Morse Kairi Harrell Nelson Santana Myra Roberts Josiah McKinney Gwendolyn Hunter Archer Ballard Alejandra Solis Ronin Glover Alessia Kemp Melvin Adkins Emelia Melendez Nikolas Jefferson Julieta Bernal Eithan Wise Mira O’Neill Marcel Waller Whitley Rios Israel Barrera Beatrice Guerrero Bryce David Haylee Deleon Nasir Romero Eliza Mason Brandon Nguyen Nova Cherry Rome Vazquez Journee Durham Kellen White Layla Mills Alex Sloan Selene Sierra Dayton Choi Karla Andrews Lukas Trevino Priscilla Jordan Sawyer Murray Faith Yates Braylon Richards Trinity Brown Elijah Stafford Bridget Quinn Rhys Banks Cali Watkins Nash Page Cataleya Byrd Cristian Frost Paula McKinney Romeo Mills June Rosales Wilder Gilbert Jocelyn Horne Zev Clements Cara Austin Omar Bowman Fiona Henderson Beau Clements Cara Farrell Ty Dunlap Iliana Blake Zyaire Prince Greta Patton Moises Tang Belle Krueger Jones Marshall Adalyn Dunlap Aries Matthews Lila Cabrera Cade David Haylee Prince Aron Russell Raelynn Valencia Dax Dennis Maisie Calderon Oakley Jenkins Rylee Nash Chandler Knapp Linda Hester Rene Potts Ellison O'Donnell Lian Huber Raquel Kane Brock Sloan Selene Rogers Colton Wade Evie Snow Houston Best Lexie Duke Kalel Andersen Zoie Booker Dominik Rivers Kiana Frazier Callum Macdonald Rosalia Brennan Curtis Osborne Shelby Oliver Karson Hart Gemma Estrada Phoenix Herrera Ximena Stokes Santana Boyd Georgia Hammond Francis Wong Adelaide Branch Keenan Fernandez Amara Jaramillo Riggs Turner Brooklyn Harper Hayes Vu Kimora Weeks Anders Valenzuela Henley Lloyd Zaire Dyer Estrella Parks Gianni Johnson Emma Wheeler Kenneth Koch Milana Marin Aldo Martin Mila Atkinson Duke Tran Kylie Larsen Brycen Alfaro Yasmin Clarke Stetson Delgado Alani Orozco Keanu Dillon Laurel Meyers Julien Cox Sadie Webb Lorenzo Boone Mariam Snyder Thiago Salinas Royalty Blair Troy Lucas Phoenix Miranda Rory Bryan Meredith McClure Reese Shaw Emersyn Cummings Raiden Henderson Maria Cunningham Alejandro Coffey Paola Logan Rocco Kaur Holland Li Jorge Carroll Zara Huang Ayaan Navarro Winter Ortiz Landon Warner Wynter Rowe Kamden Hill Hannah Madden Everest Barker Remington Reese Alijah Petersen Fernanda Hahn Kabir Lynch Malia Pugh Judson Esparza Ramona Conrad Dilan Hutchinson Jamie Montes Darren Valenzuela Henley Odom Kylian Gomez Natalie Hughes Everett Parks Ainsley Dennis Emanuel Cross Nayeli Flynn Kannon Moran Celeste Powers Sean Summers Frankie Shannon Eliel Ahmed Jolie Goodman Philip Washington Valerie Clements Fisher Gibson Eden Daniel Grady Black Molly Cruz Ryan Sierra Marceline Maddox Lyric Calhoun Thalia Moses Niklaus Barnett Harlow Potts Alfred Fernandez Amara Chang Ari Barker Remington Decker Taylor Small Zaria Sherman Adan Avila Amiyah Barajas Brennan Romero Eliza Stark Kristopher Richards Trinity Hines Uriel Bowers Elisa McIntosh Kristian Ford Alexandra Villarreal Nikolai Carrillo Kaylani Hansen Charlie Sims Lena Silva Luka Alexander Lyla Henry Carlos Xiong Amayah Short Hezekiah Sampson Meilani Barton Cassius Jennings Palmer Ferguson Miguel Lang Amirah Petersen Samson Estrada Sawyer Cole Nathaniel Kim Gabriella Donovan Brayan Harris Penelope Christensen Gregory Terry Wren Cabrera Cade Norman Malani Richard Ahmed Riley Kayla Sosa Emir Wallace Arianna Castillo Kai Berger Laylah Reynolds Vincent York Milan Stevens Zachary Molina Alexandria Dunn Dawson Martinez Harper Gibson Tyler Sawyer Marina Ray Arlo Pollard Marisol Keller Nico Acevedo Ashlynn Pierce Nicolas Dawson Veronica Davila Grey Phillips Naomi Hahn Kabir Trujillo Danielle Morse Bode Flowers Ariya Hendricks Dash Fuentes Madeleine Hopkins Ali Caldwell Evelynn Lozano Boone Davenport Adrianna Peters Patrick Rush Maleah Dalton Fletcher Santiago Nyla Stephenson Joe Watts Melissa Knox Valentin Rosales Kinley Proctor Vance McLean Sky Roy Marcelo Costa Robin Blackburn Zahir Weeks Karen Sharp Royce Palacios Bria Waller Marley Price Piper Bennett Leonardo Ponce Aileen Frye Franco Perez Eleanor Mason Brandon Krueger Kamari David Alonso Vasquez Rose Kramer Kylan Moody Elaine Spencer Ace Pope Aurelia Rosales Wilder Gaines Aya Ware Tadeo Cordova Florence Ortiz Landon Huffman Hayley McKinney Romeo Flores Emilia Randolph Eugene Larsen Xiomara Atkins Cason Ball Abby Snyder Thiago Powell Vivian Pittman Valentino Jacobs Camilla Hurley Van Silva Lucia Pierce Nicolas Calderon Serena Shields Devon Leach Martha Vance Casen Decker Aleena Flores Lincoln Dickson Emmalynn Bravo Genesis Walsh Leia House Yehuda Rowland Harleigh Colon Bruce Lane Amy Xiong Azrael Young Zoey Duncan Avery Olson Isabel Henson Bellamy Singh Vivienne Collins Miles Henderson Maria Roman Kian Esparza Ramona Esquivel Bridger McClure Estella Hodge Reign Eaton Miley O'Donnell Lian Potts Ellison Michael Bronson Jefferson Julieta Avery Jakari Lambert Nina Tapia Samir Watts Melissa Howell Bradley Horton Aitana Rowe Kamden Oliver Camille Cuevas Brecken Roberson Sasha Hubbard Forrest Serrano Allie Horton Garrett Barron Anya Prince Aron Mann Paislee Holt Niko McKee Kori Middleton Misael Lin Makenna Buck Jon Simmons Reagan Ashley Kylen Bonilla Romina Morrison Maximus Gardner Jordyn Ball Shane Boone Mariam Peck Yousef Gates Melina Evans Elias Daniel Joy Washington Juan Reynolds Isabelle Tate Dalton Hubbard Rosie Camacho Tatum Quintero Keyla Wagner Enzo Hunt Genevieve Hernandez Mason Bowman Fiona Bradshaw Emory Solomon Mylah Ortiz Landon Aguilar Josie Phan Maison Phillips Naomi Rich Miller Wyatt Liberty Bates Ellis Cummings Nylah Figueroa Spencer Quinn Heaven Campos Gideon Wiley Lauryn Calhoun Gary Griffin Charlie Franco Gage Pittman Marie Foster Kayden Davenport Adrianna Dudley Colter Sherman Addilyn Duke Kalel Wiley Lauryn Ahmed Harry Esparza Ramona Reid Josue Hail Lainey Lim Cal Moreno Mary Andersen Alistair Love Avianna Zuniga Sincere Weaver Teagan Mason Brandon Santiago Nyla Page Pablo Reed Valentina Jenkins Declan Moss Bianca Macias Moshe Mata Lillie Wells Max Zamora Sierra Trejo Wesson Velasquez Esme Hopkins Ali Hawkins Ariel Rodgers Mathias Noble Hunter Pearson Gunner Mays Denisse Everett Camilo Parker Aubrey Donaldson Canaan Kerr Baylee Mathews Jamir Hurst Adalee Macdonald Hugh Doyle Annalise Boyd Dean Moran Celeste Villanueva Huxley Gates Melina Schaefer Ishaan Barr Noemi Gallagher Marcos Aguilar Josie McPherson Foster Boone Mariam Cobb Raphael Dawson Veronica Harrell Nelson Doyle Annalise Fleming Fernando Santos Alana Cortez Zayn Malone Skyler Knight Beckett Koch Milana Pacheco Erik Goodwin Shiloh Cruz Ryan Banks Cali Stein Creed Hebert Kyleigh Rivers Bear Lang Amirah Bradford Ander Mendez Londyn Cohen Killian Hoffman Aspen Archer Ephraim Butler Athena Bentley Randy Hart Gemma Lu Duncan Woods Reese Lim Cal Leonard Demi Erickson Johnny Hayden Avayah Carr Kash Odom Laylani Fernandez Bentley Kemp Anika Fitzpatrick Blaze Harrell Kara Callahan Quinton McKenzie Briar Rowland Eliezer Carter Lucy Padilla Jaden Barton Danna Villalobos Reuben Bauer Haley Greer Koda Pena Rachel Burgess Kolton Berry Annabelle McIntyre Eliseo Ortega Lilah Booker Dominik Fisher Arya Phan Maison Dennis Maisie Thomas Logan Leonard Demi Mann Nehemiah Maldonado Elaina Norris Cairo Fischer Maci Bond Roger Frazier Octavia Schneider Raymond Adkins Emelia Richards Holden Ochoa Luciana Horn Wilson Chang Ophelia Rivers Bear Harding Aniya Ahmed Harry Stokes Miranda Freeman Jayce Pittman Marie Raymond Maurice Quinn Heaven Wilcox Jerry Decker Aleena Noble Idris Huerta Dulce Pennington Bobby Savage Louise Pittman Valentino Stuart`;

  const lotsOfNamesArray = lotsOfNames.split(" ");

  function court(name = "", judges = 0, waitingList = "") {
    if (judges < 1) {
      return Infinity;
    }

    // ESCAPE: If we are the only person in line, we'll be seen immediately
    if (waitingList.length === 0) {
      return APPOINTMENT_LENGTH;
    }

    const waitingNames = waitingList.split(" ");

    waitingNames.push(name);

    waitingNames.sort();

    const nameIndex = waitingNames.indexOf(name);

    if (nameIndex < judges) {
      return APPOINTMENT_LENGTH;
    }

    return (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
  }

  bigNumbers.addEventListener("click", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const judges = document.getElementById("judges").value;
    const names = Array.from(
      { length: 10000 },
      () =>
        lotsOfNamesArray[Math.floor(Math.random() * lotsOfNamesArray.length)]
    ).join(" ");

    if (typeof name !== "undefined" && name !== "" && judges > 0) {
      performance.mark("court-big-numbers-start");
      const waitTime = court(name, judges, names);
      performance.mark("court-big-numbers-end");
      performance.measure(
        "court-big-numbers",
        "court-big-numbers-start",
        "court-big-numbers-end"
      );

      results.innerText = `Hey there, ${name}! With ${
        names.split(" ").length
      } people here, you will be headed home in ${waitTime} minutes`;

      performance.getEntriesByType("measure").forEach((measure) => {
        console.log(measure);
      });
    } else {
      results.innerText =
        "Sorry, we couldn't process the information you entered.";
    }
  });

  reallyBigNumbers.addEventListener("click", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const judges = document.getElementById("judges").value;
    const names = Array.from(
      { length: 1000000 },
      () =>
        lotsOfNamesArray[Math.floor(Math.random() * lotsOfNamesArray.length)]
    ).join(" ");

    performance.mark("court-really-big-numbers-start");
    const waitTime = court(name, judges, names);
    performance.mark("court-really-big-numbers-end");
    performance.measure(
      "court-really-big-numbers",
      "court-really-big-numbers-start",
      "court-really-big-numbers-end"
    );

    results.innerText = `Hey there, ${name}! With ${
      names.split(" ").length
    } people here, you will be headed home in ${waitTime} minutes`;

    performance.getEntriesByType("measure").forEach((measure) => {
      console.log(measure);
    });
  });

  calculate.addEventListener("click", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const judges = document.getElementById("judges").value;
    const names = document.getElementById("names").value;

    if (typeof name !== "undefined" && name !== "" && judges > 0) {
      performance.mark("court-calculate-start");
      const waitTime = court(name, judges, names);
      performance.mark("court-calculate-end");
      performance.measure(
        "court-calculate",
        "court-calculate-start",
        "court-calculate-end"
      );

      results.innerText = `Hey there, ${name}! You will be headed home in ${waitTime} minutes`;

      performance.getEntriesByType("measure").forEach((measure) => {
        console.log(measure);
      });
    } else {
      results.innerText =
        "Sorry, we couldn't process the information you entered.";
    }
  });

  clear.addEventListener("click", (event) => {
    event.preventDefault();

    results.innerText = "";
    document.getElementById("name").value = "";
    document.getElementById("judges").value = "";
    document.getElementById("names").value = "";
  });
})();
