export class ReservationDataType  {
    /**
     * Reservation start time
     */
    public time: Number;
    /**
     * Reservation end time
     */
    public endTime: Number;
    /**
     * Cutomer who reserved for the slot
     */
    public customerName: String;
    /**
     * Cutomer address
     */
    public address1: String;
    public address2: String;
    public city: String;
    public state: String;
    public zip: String;

    constructor( body: any ) {
        this.time = body.time;
        this.endTime = body.endTime;
        this.customerName = body.customerName;
        this.address1 = body.address1;
        this.address2 = body.address2;
        this.city = body.city;
        this.state = body.state;
        this.zip = body.zip;
    }
};