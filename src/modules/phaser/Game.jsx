import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

import 'assets/scss/game.scss';
import moment from 'moment';
import { useCustomSelector } from 'helper/functions';
import Swal from 'sweetalert2';
import { questionAverage, questionBasic, questionNoIdea } from './question';
import { useHistory } from 'react-router';
function Game() {
    const history = useHistory();

    const game = useRef();
    const gameRef = useRef();
    const road = useRef();
    
    const hiddenWall = useRef();
    const cones = useRef({ used: [], unused: [] });
    const nextConeToDisplayPos = useRef(0);
    const box = useRef();

    const totalSavingText = useRef();
    const player = useRef();
    const totalConesDisplayed = useRef(1);
    const time = useRef(moment());

    // user info
    const { info: userInfo } = useCustomSelector("personalInfo");
    const { details: planInfo } = useCustomSelector("plan");

    const totalSavings = useRef(userInfo?.salary? parseInt(userInfo?.salary): 2000);
    const originalTotalSavings = useRef(userInfo?.salary? parseInt(userInfo?.salary): 2000);
    const yearlyCost = useRef(planInfo?.yearlyFees? parseInt(planInfo?.yearlyFees):0);
    const age = useRef(parseInt(userInfo?.age));
    const maxSavings = useRef(originalTotalSavings.current * (80 - parseInt(age.current)));

    // Grab list of questions based on literacy
    let questions = [];
    switch (userInfo?.literacy) {
        case "No Idea":
            questions = questionNoIdea();
            break;
        case "Basic":
            questions = questionBasic();
            break;
        case "Average":
            questions = questionAverage();
            break;
        default:
            questions = questionNoIdea();
    }

    // list of big obstacles
    const bigObstacleList = [
        {
            type: "Cancer",
            amount: 150000,
            insuranceType: "Critical Illness Plan"
        },
        {
            type: "Heart Attack",
            amount: 35000,
            insuranceType: "Critical Illness Plan"
        },
        {
            type: "Stroke",
            amount: 50000,
            insuranceType: "Critical Illness Plan"
        },
        {
            type: "Hospitalized for 3 days & outpatient",
            amount: 350,
            insuranceType: "Hospitalization Plan"
        },
        {
            type: "Hospitalized for 6 days & outpatient",
            amount: 700,
            insuranceType: "Hospitalization Plan"
        },
        {
            type: "Hospitalized for 9 days & outpatient",
            amount: 1300,
            insuranceType: "Hospitalization Plan"
        },
    ];

    var config = {
        type: Phaser.AUTO,
        width: 250,
        height: 450,
        parent: "app",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
            },
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };


    useEffect(() =>{   
        game.current = new Phaser.Game(config);
    }, [])
    

    function preload ()
    {
        // Loading assets
        this.load.image('road', "assets/road.png");
        this.load.image('cone', "assets/cone.png");
        this.load.image('box', "assets/box.png");
        this.load.image('player', "assets/player.png");
        this.load.image('wall', "assets/wall.png");
        this.load.image('shield', "assets/shield.png");
    }

    function create ()
    {
        gameRef.current = this;

        // Road
        road.current = this.add.tileSprite(0, 0, 250, 450, "road", null, 100).setOrigin(0, 0);

        // Player
        let initPlayer = this.physics.add.image(125, 450, 'player');
        player.current = initPlayer;
        initPlayer.setCollideWorldBounds(true);

        // Hidden wall used to indicate that the obstacles has reached bottom of the screen.
        hiddenWall.current = this.physics.add.image(0, 450, 'wall');
        hiddenWall.current.setCollideWorldBounds(true);

        // Create 10 cones and reuse them
        for (let i = 0; i < 4; i++) {
            let cone = gameRef.current.physics.add.image(-1000, 0, 'cone');
            handleCollission(cone);
            cones.current.unused.push(cone);
        }

        displayOneCone();

        // Create only 1 box
        box.current = gameRef.current.physics.add.image(-1000, 0, 'box');
        gameRef.current.physics.add.collider(player.current, box.current, (player, box) => {
            box.x = -1000;
            box.setVelocityX(0);

            // pause all object
            this.scene.pause();

            let illness = bigObstacleList[Math.floor(Math.random() * (bigObstacleList.length))];

            Swal.fire({
                title: "You've got '" + illness?.type?.toLowerCase() + "'",
                text: "You must pay RM" + illness?.amount + ". BUT this bill can be waived if you get the next question right. Good Luck!",
                icon: 'warning',
                confirmButtonColor: '#00FF00',
                confirmButtonText: 'Next',
                reverseButtons: true
            }).then((result) => {
                let position = Math.floor(Math.random() * questions.length);
                let isFirstAnswer = Math.random() > 0.5;
                let confirmText = (isFirstAnswer)? questions[position]?.correct: questions[position]?.wrong;
                let cancelText = (isFirstAnswer)? questions[position]?.wrong: questions[position]?.correct;

                Swal.fire({
                    text: questions[position]?.question,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#707070',
                    cancelButtonColor: '#707070',
                    confirmButtonText: confirmText,
                    cancelButtonText: cancelText,
                    reverseButtons: true
                }).then((result) => {
                    if ((isFirstAnswer && result?.isConfirmed) ||
                        (!isFirstAnswer && result?.isDismissed)) {

                        Swal.fire({
                            text: "Congrats! You're safe!",
                            icon: 'success',
                            confirmButtonColor: '#00FF00',
                            confirmButtonText: 'Resume',
                        }).then(() => {
                            this.scene.resume();
                        });
                    }
                    else {
                        if (planInfo?.plan.toLowerCase() === illness?.insuranceType?.toLowerCase()) {
                            Swal.fire({
                                text: "Your " + illness?.insuranceType  + " has covered the cost for you. You only have to pay RM250.",
                                icon: 'success',
                                confirmButtonColor: '#00FF00',
                                confirmButtonText: 'Resume',
                            }).then((result) => {
                                totalSavings.current -= 250;
                                if (!checkGameOver()) this.scene.resume();
                            });
                        }
                        else {
                            Swal.fire({
                                text: "Unfortunately, you have to pay RM" + illness?.amount + ". Please subscribe to " + illness?.insuranceType + " in order to cover this type of event.",
                                icon: 'error',
                                confirmButtonColor: '#00FF00',
                                confirmButtonText: 'Resume',
                            }).then((result) => {
                                totalSavings.current -= illness?.amount;
                                if (!checkGameOver()) this.scene.resume();
                            });
                        }
                    }
                })
            })
        });


        // Life info
        var lifeInfo = this.add.rectangle(125, 25, 232, 40, 0xFFFFFF);
        this.tweens.add({
            targets: lifeInfo,
            alpha: 0.5,
        });
        this.add.text(25, 5, "Net Saving:", { font: "12px Montserrat", fill: "#000000", align: "center" });
        totalSavingText.current = this.add.text(180, 5, totalSavings.current, { font: "12px Montserrat", fill: "#000000", align: "center" });

        // bordered rectangle
        updateSavingBar();

        // Shield
        let shield = this.add.image(220, 15, 'shield').setOrigin(0, 0);
    }
    
    function update ()
    {
        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown)
        {
            player.current.setVelocityX(-1000);
        }
        else if (cursors.right.isDown)
        {
            player.current.setVelocityX(1000);
        }
        else
        {
            player.current.setVelocityX(0);
        }

        let diff = moment().diff(time.current, 'seconds');
        if (diff >= 1) {
            checkUnusedCones();
            time.current = moment();
            totalConesDisplayed.current += 1;
        }

        if (totalConesDisplayed.current == 5) {
            box.current.x = Math.random() * 250;
            box.current.y = 0;
            box.current.setVelocityY(0);
            totalConesDisplayed.current = 1;
            age.current += 1;
            
            totalSavings.current += originalTotalSavings.current;
            totalSavings.current -= yearlyCost.current;

            checkGameOver();
            recreateTotalSavingText();
            updateSavingBar();
        }

        // Update road image
        road.current.tilePositionY -= 4;
    }

    function checkGameOver() {
        if (totalSavings.current <= 0) {
            
            Swal.fire({
                text: "GAME OVER",
                icon: 'error',
                confirmButtonColor: '#00FF00',
                // cancelButtonColor: '#00FF00',
                confirmButtonText: "Restart Game",
                // cancelButtonText: "Update Player Info",
                // reverseButtons: true
            }).then((result) => {
                if (result?.isConfirmed) {
                    // gameRef.current.registry.destroy(); // destroy registry
                    // gameRef.current.events.off(); // disable all active events
                    // gameRef.current.scene.restart(); // restart current scene

                    // gameRef.current.sys.game.destroy(true);
                    // game.current = new Phaser.Game(config);

                    // history.push("/game");
                    window.open("/", "_self");
                }
                else {
                    history.push("/");
                }
            });

            return true;
        }
        else return false;
    }

    function displayOneCone() {
        // Display 1 cone initially
        if (nextConeToDisplayPos.current == cones.current.unused.length) {
            nextConeToDisplayPos.current = 0;
        }
        let unusedCone = cones.current.unused[nextConeToDisplayPos.current];
        unusedCone.x = Math.random() * 250;
        unusedCone.y = 0;
        unusedCone.setVelocityX(0);
        unusedCone.setVelocityY(0);
        // cones.current.used.push(unusedCone);
        // cones.current.unused.splice(0, 1);
        nextConeToDisplayPos.current += 1;
    }

    function checkUnusedCones() {
        // check for any unused cone
        // if (!(cones.current?.unused?.length > 0)) {
        //     // Reset
        //     for (let i = 0; i < cones.current.used.length; i++) {
        //         cones.current.unused.push(cones.current.used[i]);
        //     }
        //     cones.current.used = [];
        // }
        displayOneCone();
    }

    function recreateTotalSavingText() {
        totalSavingText.current.destroy();
        totalSavingText.current = gameRef.current.add.text(180, 5, totalSavings.current, { font: "12px Montserrat", fill: "#000000", align: "center" });
    }

    function handleCollission(obstacle) {
        gameRef.current.physics.add.collider(obstacle, hiddenWall.current, (obstacle, wall) => {
            obstacle.x = -1000;
            obstacle.setVelocityX(0);
        });
        
        gameRef.current.physics.add.collider(player.current, obstacle, hitObstacle);
    }

    function updateSavingBar() {
        let graphics = gameRef.current.add.graphics();
        let ratio = totalSavings / maxSavings;

        graphics.fillStyle(0xffffff);
        graphics.fillRoundedRect(21, 21, 185, 20, 4);

        graphics.lineStyle(2, 0x6BD700, 1);
        graphics.strokeRoundedRect(21, 21, 185, 20, 4);

        graphics.fillStyle(0x9DFF6F);
        graphics.fillRoundedRect(23, 23, 182 * (totalSavings.current/maxSavings.current), 16, ratio > 0.1 ? 10: 0);
    }

    function hitObstacle(player, obstacle) {
        obstacle.x = -1000;
        obstacle.setVelocityX(0);
        totalSavings.current -= 250;
        checkGameOver();
        recreateTotalSavingText()
        updateSavingBar();
    }

    return ("")
}

export default Game
