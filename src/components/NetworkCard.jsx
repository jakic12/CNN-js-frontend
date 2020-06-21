import React, { useState } from "react";
import styled, { css } from "styled-components";

//redux
import { connect } from "react-redux";

//res
import { TiPlus } from "react-icons/ti";

// router
import { Link } from "react-router-dom";

const cardWrapperCss = css`
  width: 13em;
  height: 15em;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0.7em;
  flex-grow: 0;
  flex-shrink: 0;

  transform: scale(1);
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  background: ${(props) => props.backgroundbyelevation(1)};
  text-decoration: none;
  color: ${(props) => props.accenttextcolor};
  display: block;
`;

const CardWrapper = styled(Link)`
  ${cardWrapperCss}
`;

const CardWrapperNoLink = styled.div`
  ${cardWrapperCss}

  &:hover {
    cursor: pointer;
  }
`;

const BottomWrapper = styled.div`
  height: 30%;
  width: 100%;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const NetworkTitle = styled.h4`
  height: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

const NetworkImage = styled.img`
  width: 100%;
  display: block;
  flex-grow: 0;
`;

const NetworkImageDiv = styled.div`
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export default connect((state) => state)(
  ({ colors, network, server, draggable, onClick, getRef, id }) => {
    /*
    // draggable too buggy
    const [dragging, setDragging] = useState(false);
    const [cardPosition, setCardPosition] = useState();

    const cardRef = React.createRef();
    const replacementCardRef = React.createRef();*/

    const Wrapper = onClick ? CardWrapperNoLink : CardWrapper;

    return (
      <Wrapper
        id={id}
        to={onClick ? "" : `/networks/${server}/${network.id}`}
        onClick={onClick}
        {...colors}
        ref={getRef && ((ref) => getRef(ref))}
        /*
        // draggable too buggy
        
        ref={cardRef}
        onMouseDown={
          draggable
            ? function(e) {
                var draggingElement = cardRef.current;
                var clientRect = draggingElement.getBoundingClientRect();
                e.preventDefault();
                var dragStart = { x: e.clientX, y: e.clientY };
                var localDragging = false;
                var draggingOffset = {
                  x: e.clientX - clientRect.left,
                  y: e.clientY - clientRect.top
                };

                const dragHandler = e1 => {
                  if (!localDragging) {
                    if (
                      Math.abs(e1.clientX - dragStart.x) > 10 ||
                      Math.abs(e1.clientY - dragStart.y) > 10
                    ) {
                      setDragging(true);
                      localDragging = true;
                    }
                  } else {
                    draggingElement.style.position = `absolute`;
                    draggingElement.style.left =
                      e1.clientX - draggingOffset.x + `px`;
                    draggingElement.style.top =
                      e1.clientY - draggingOffset.y + `px`;
                  }
                };

                const mouseUpHandler = () => {
                  localDragging = false;
                  document.removeEventListener("mousemove", dragHandler);
                  document.removeEventListener("mousemove", mouseUpHandler);
                };

                document.addEventListener("mousemove", dragHandler);
                document.addEventListener("mouseup", mouseUpHandler);
              }
            : undefined
        }
        onClick={
          dragging
            ? e => {
                e.preventDefault();
                setDragging(false);
              }
            : undefined
        }*/
      >
        <NetworkImageDiv>
          <NetworkImage
            src={process.env.PUBLIC_URL + `/cnn-diagram.png`}
            alt="neural network icon"
          />
        </NetworkImageDiv>
        <BottomWrapper>
          <NetworkTitle>{network.name}</NetworkTitle>
        </BottomWrapper>
      </Wrapper>
    );
  }
);

const AddNetworkWrapper = styled.div`
  ${cardWrapperCss}
  border:2px ${(props) => props.color} dashed;
  display:flex;
  justify-content:center;
  flex-direction:row;
  align-items:center;
  background:${(props) => props.backgroundbyelevation(1)};
  box-sizing:border-box;
  font-size: 1em;
  position:relative;

  /* &:hover{
    cursor:pointer;
  } */

  ${(props) =>
    props.nohover &&
    css`
      &:hover {
        transform: scale(1);
      }
    `}
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledSubmit = styled.input`
  position: absolute;
  bottom: 1em;
  width: calc(100% - 2em);
  box-sizing: border-box;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  padding: 5px;
  box-sizing: border-box;
  /*border-radius: 5px;*/
  border: none;
  width: calc(100% - 5em);
  margin: 1em;
  border-bottom: 1px solid black;
`;

const StyledSelect = styled.select`
  border: none;
  padding: 0.3em;
`;

export const AddNetworkCard = connect((state) => state)(
  ({ colors, onclick, networks, id }) => {
    const [name, setName] = useState(``);
    const [networkShapeIndex, setNetworkShapeIndex] = useState(0);
    const [show, setShow] = useState(false);

    return (
      <AddNetworkWrapper
        id={id}
        color={colors.primaryColor}
        backgroundbyelevation={colors.backgroundbyelevation}
        onClick={() => setShow(true)}
        nohover={show}
      >
        {show && (
          <StyledForm
            onSubmit={(e) => {
              e.preventDefault();
              if (name) {
                onclick(
                  name,
                  networks.networkArchitectures[
                    Object.keys(networks.networkArchitectures)[
                      networkShapeIndex
                    ]
                  ]
                );
              }
            }}
          >
            <StyledInput
              type="text"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              placeholder={`Network name`}
            />
            <StyledSelect
              onChange={(e) => setNetworkShapeIndex(JSON.parse(e.target.value))}
              value={networkShapeIndex}
            >
              {Object.keys(networks.networkArchitectures).map((name, i) => {
                return <option value={i}>{name}</option>;
              })}
            </StyledSelect>
            <StyledSubmit
              type="submit"
              value="create network"
              id={`createNetworkHint`}
            />
          </StyledForm>
        )}
        {!show && <TiPlus color={colors.primaryColor} />}
      </AddNetworkWrapper>
    );
  }
);

const NetworkCardParentWrapper = styled.div`
  padding: 1em;
  /* padding-right: 0; */
  padding-bottom: 0;

  width: 100%;
  box-sizing: border-box;

  transition: 0.5s padding;

  ${(props) =>
    props.small &&
    css`
      padding-right: 1em;
    `}
`;

const Title = styled.h3`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;

  ${(props) =>
    props.cardMode &&
    css`
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
        0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
      margin: 0;
      padding: 0.5em;
      border-radius: 5px;
    `}

  transition: .5s;
`;

const NetworkCards = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
  box-sizing: border-box;
  padding: 1em;
  padding-right: 0;
  box-sizing: border-box;
  height: auto;

  ${CardWrapper}:first-child {
    margin-left: 0;
  }

  transition: 0.5s height, 0.5s padding;
  ${(props) =>
    props.small &&
    css`
      height: 0;
      padding: 0;
    `}
`;

const NetworkScreenTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const NetworkCardParent = ({
  children,
  title,
  small,
  customRightButton,
}) => (
  <NetworkCardParentWrapper small={small}>
    <div>
      {!customRightButton && <Title cardMode={small}>{title}</Title>}
      {customRightButton && (
        <NetworkScreenTitleWrapper>
          <Title cardMode={small}>{title}</Title>
          <FlexCenter>{customRightButton}</FlexCenter>
        </NetworkScreenTitleWrapper>
      )}
    </div>
    <NetworkCards small={small}>{children}</NetworkCards>
  </NetworkCardParentWrapper>
);
