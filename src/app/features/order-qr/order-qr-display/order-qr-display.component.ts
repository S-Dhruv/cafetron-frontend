import { ChangeDetectorRef, Component, Input, OnInit, numberAttribute } from "@angular/core";
import { OrderQRService } from "../order-qr.service";
import { CommonModule } from "@angular/common";
import { getApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'order-qr-display',
    templateUrl: './order-qr-display.component.html',
    styleUrl: './order-qr-display.component.css'
})
export class OrderQRDisplayComponent implements OnInit {

    @Input({ required: true, transform: numberAttribute })
    orderId: number = 0;
    
    base64QRString: string = '';
    errorMessage: string = '';
    isLoading = true;

    constructor(
        private orderQRService: OrderQRService,
        private cdr: ChangeDetectorRef
    ){}

    ngOnInit(): void {
        if (!this.orderId || this.orderId <= 0) {
            console.error('Invalid orderId provided for QR display');
            this.errorMessage = 'Invalid order selected.';
            this.isLoading = false;
            return;
        }

        this.orderQRService.getQR(this.orderId).subscribe({
            next: (result) => {

                this.base64QRString = result.base64QRString;
                this.errorMessage = '';
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed:', err);
                this.base64QRString = '';
                this.errorMessage = getApiErrorMessage(
                    err,
                    'Pickup QR is available only after the vendor accepts the order.'
                );
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
