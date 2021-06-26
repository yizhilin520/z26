import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 12,
    left: 'calc(-50% + 10px)',
    right: 'calc(40% + 20px)',
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient(to right, #83c8ff, #3977fe), linear-gradient(to bottom, #eeeeee, #d8d8d8)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient(to right, #83c8ff, #3977fe), linear-gradient(to bottom, #eeeeee, #d8d8d8)',
    },
  },
  line: {
    height: 8,
    border: 0,
    backgroundColor: '#e6eaf3',
    borderRadius: 1,
  },
  
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundImage: 'linear-gradient(173deg, #E7E7E7 0%, #B3B3B3 100%)',
    zIndex: 1,
    color: '#fff',
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: 24,
    top: 10,
  },
  active: {
    backgroundImage: 'linear-gradient(132deg, #3DA3F1 0%, #116AED 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage: 'linear-gradient(132deg, #3DA3F1 0%, #116AED 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {props.icon}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding:0,
  },
  label: {
    fontSize: 22
  },
  activeLabel: {
    color: '#1F77F1'
  }
}));

function getSteps() {
  return ['身份验证', '修改密码', '完成'];
}
  
export default function HorizontalLabelPositionBelowStepper(props:any) {
  const stepNumber = props.stepNumber
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  
 useEffect(() => {
  setActiveStep(stepNumber)
   return () => {
     
   };
 }, [stepNumber]);
  
  return (
    <div className={classes.root}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className={clsx(classes.label, {[classes.activeLabel]: index <= activeStep})}>{label}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}