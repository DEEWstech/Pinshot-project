import { useFetch, useSlide, useTitle } from "@hooks";
import { PageLayout } from "@layouts";
import { useParams } from "react-router-dom";
import { pinService } from "@services";
import { Spinner } from "@utils";
import { Row, Col, Image } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaExpandAlt } from "react-icons/fa";
import { IoIosArrowDropleft, IoIosArrowDropright  } from "react-icons/io";

export default function PinDetails() {
  const { pinId } = useParams();
  const { error, data: pin, loading } = useFetch(pinService.getAPin, pinId);

  const { nextSlide, prevSlide, current, setCurrent } = useSlide(
    pin?.image?.length
  );
  useTitle(pin?.title);
  uuidv4();

  console.log(pin);

  return (
    <PageLayout>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {loading && <Spinner text="Fetch pin" />}
          <Row className="g-3">
            <Col lg={6} className="mb-4">
              <div className="w-100">
                {pin.image?.map((img, i) => (
                  <div key={uuidv4()} className="pinId-Img position-relative">
                    {i === current && (
                      <>
                        <LazyLoadImage
                          effect="blur"
                          src={img}
                          alt={pin.title}
                          className="rounded-4 object-fit-cover"
                          width="100%"
                          height="100%"
                          title="click to view full size"
                        />
                        <div className="position-absolute top-0 end-0 p-2">
                        <FaExpandAlt color="white cursor" size="18px" />
                        </div>
                        {pin.image?.length > 1 && (
                            <div className="focus-arrow">
                                <IoIosArrowDropleft className="position-absolute top-50 start-0 translate-middle z-2 cursor" />
                                <IoIosArrowDropright  className="position-absolute top-50 start-100 translate-middle z-2 cursor"/>
                            </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </>
      )}
    </PageLayout>
  );
}
